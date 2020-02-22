import React from 'react';
import {View,StatusBar,ActivityIndicator,TouchableOpacity,Platform,Switch,TextInput, Text,Animated,Image, StyleSheet, I18nManager} from 'react-native';
import './global'
import Toast from "./SimpleToast";
import EventListener, {EventRegister} from 'react-native-event-listeners'
export default class ResetPassScreen extends React.Component {

    constructor(props){
        super(props);
        this.state={password:'',confirmPassword:'',Secure1:true,Secure2:true}
        this.ResetPassword=this.ResetPassword.bind(this)

    }
    ChangeSecure1(){
        this.state.Secure1==true?this.setState({Secure1:false}):this.setState({Secure1:true})
    }
    ChangeSecure2(){
        this.state.Secure2==true?this.setState({Secure2:false}):this.setState({Secure2:true})
    }
    ChangePassword(text){
        this.setState({password:text.trim()})
    }
    ChangeConfirmPassword(text){
        this.setState({confirmPassword:text.trim()})
    }
    async ResetPassword()
    {
        try {

            let ResetAddress = global.ApiAddress + "/user/reset-password";
            if (this.state.password == '' || this.state.confirmPassword == '') {
                Toast.showWithGravity('رمز عبور نباید خالی باشد', Toast.LONG, Toast.CENTER)
                this.setState({loading:false})
            }

            else if (this.state.password != this.state.confirmPassword) {
                Toast.showWithGravity('رمز عبور با تکرار رمز عبور مطابقت ندارد', Toast.LONG, Toast.CENTER)
                this.setState({loading:false})
            }
            else if (this.state.password.length < 6) {
                Toast.showWithGravity('رمز عبور حداقل 6 کاراکتر باید باشد', Toast.LONG, Toast.CENTER)
                this.setState({loading:false})
            }
            else {
                this.setState({loading:true})
                var formData = new FormData();
                formData.append('username', this.props.navigation.state.params.username)
                formData.append('password', this.state.password)
                formData.append('reset_token',this.props.navigation.state.params.resetToken)
                let response = await fetch(ResetAddress, {
                    method: 'POST',
                    headers: {},
                    body: formData
                });
                let Data = await response.json();
                if (Data.data.status == "success") {
                    this.setState({loading:false})
                    EventRegister.emitEvent('CheckLogin')
                    Toast.showWithGravity('رمز عبور جدید با موفقیت ثبت شد',Toast.LONG,Toast.CENTER)
                    this.props.navigation.navigate(this.props.navigation.state.params.RouteName);

                }
                else if (Data.data.status == "fail") {
                    if (Data.data.message == "reset token is incorrect") {
                        Toast.showWithGravity('تغییر رمز عبور نا معتبر است.', Toast.LONG, Toast.CENTER)
                        this.setState({loading:false})
                    }
                }
            }
        }
        catch(err)
        {

        }

    }
    render() {
        return(
            <View style={styles.Container}>
                <StatusBar hidden />
                <View style={styles.Header}>
                    <View style={styles.RightContainer}>

                        <Text style={styles.HeaderTitle}> رمزنامه</Text>
                    </View>
                    <View style={styles.LeftContainer}>

                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} activeOpacity={.6}>
                            <Image style={styles.MenuIcon} source={require('.././images/Back.png')}/>
                        </TouchableOpacity>

                    </View>


                </View>
                <View style={styles.Box}>
                    <View style={styles.Top}>
                        <Text style={styles.HeaderTitle}>تعیین رمز جدید</Text>
                        <Image source={require('.././images/ResetPass.png')}
                               style={styles.Logo}
                        />
                    </View>
                    <View style={styles.Bottom}>


                        <View style={{flexDirection:I18nManager.isRTL?'row':'row-reverse'}}>
                            <TextInput secureTextEntry={this.state.Secure1} onChangeText={this.ChangePassword.bind(this)} ref={(input) => { this.secondTextInput = input; }} style={[styles.TextInput,{flex:9}]} underlineColorAndroid={'transparent'}
                                       onSubmitEditing={()=>this.thirdTextInput.focus()} placeholder={'رمز عبور جدید را وارد کنید(حداقل 6 کاراکتر)'} placeholderTextColor={global.Gray2}
                            />
                            <Switch  value={this.state.Secure1} onValueChange={this.ChangeSecure1.bind(this)}/>
                        </View>

                        <View style={{flexDirection:I18nManager.isRTL?'row':'row-reverse'}}>
                            <TextInput secureTextEntry={this.state.Secure2} onChangeText={this.ChangeConfirmPassword.bind(this)} ref={(input) => { this.thirdTextInput = input; }} style={[styles.TextInput,{flex:9}]} underlineColorAndroid={'transparent'}
                                       placeholder={'رمز عبور را تکرار کنید'} placeholderTextColor={global.Gray2}
                            />
                            <Switch  value={this.state.Secure2} onValueChange={this.ChangeSecure2.bind(this)}/>
                        </View>
                        {
                            this.state.loading ?
                                <View style={styles.DisableBtn}>
                                    <ActivityIndicator size="small" color="#515151"/>
                                    <Text style={styles.ButtonText}>تایید</Text>

                                </View>
                                :
                                <TouchableOpacity onPress={()=>this.ResetPassword()} activeOpacity={.7} style={styles.RegisterBtn}>
                                    <Text style={styles.ButtonText}>تایید</Text>
                                </TouchableOpacity>
                        }
                    </View>

                </View>


            </View>
        )
    }
}
const styles = StyleSheet.create({

    Container: {
        justifyContent:'center',
        alignItems:'center',
        flex: 1,
        backgroundColor:global.LightContainer1,
    },
    Box:{
        width:'80%',
        borderRadius:3,
        justifyContent:'center',
        alignItems:'center',
        elevation:10

    },
    Top:{
        borderTopRightRadius:3,borderTopLeftRadius:3,
        width:'100%',
       // height:50,
        backgroundColor:global.HeaderColor
    },
    Bottom:{
        borderBottomRightRadius:3,borderBottomLeftRadius:3,
        paddingTop:10,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:global.LightContainer,
    },
    Header:{
        backgroundColor:global.HeaderColor,
        position:'absolute',
        width:'100%',
        top:0,
        height:40,
        alignItems:'center',
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        zIndex:997
    },
    HeaderTitle:{
        textAlign:'center',
        margin:10,
        fontFamily:Platform.OS=='ios'?'IRANSansMobile':'IRANSansMobile_Bold',
        fontWeight:Platform.OS=='ios'?'bold':null,
        fontSize:global.fontSize13,
        color:'#F5F5F5'
    },
    RightContainer:{
        flexDirection:'row',
        flex:.7,
        justifyContent:I18nManager.isRTL?'flex-start':'flex-end',
        alignItems:'center'
    },
    LeftContainer:{
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        flex:.7,
        justifyContent:'flex-end',
        alignItems:'center'
    },
    MenuIcon:{
        margin:10,
        height:15,
        width:15,
        resizeMode:'stretch'
    },
    Logo:{
      //  marginTop:20,
        marginBottom:10,
        resizeMode:'stretch',
        alignSelf:'center',
        height:35,
        width:40
    },
    DrawerIcon:{
        marginLeft:5,marginRight:5,
        height:20,
        width:20,
        resizeMode:'stretch'
    },
    DisableBtn:{
        flexDirection:I18nManager.isRTL?'row':'row-reverse',
        alignSelf:'center',
        marginTop:10,
        margin:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:global.Gray3,
        borderWidth:1,
        borderColor:global.Gray3,
        borderRadius:3,
        height:40,
        width:150,
    },
    RegisterBtn:{
        marginTop:10,
        margin:10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:global.HeaderColor,
        borderWidth:1,
        borderColor:global.HeaderColor,
        borderRadius:3,
        height:40,
        width:150,
    },
    ButtonText:{
        fontFamily:'IRANSansMobile',
        fontSize:global.fontSize12,
        color:global.White1
    },
    TextInput:{
        borderRadius:5,
        margin:5,
        fontSize:global.fontSize12,
        fontFamily:global.fontFamily,
        height:45,
        width:'80%',
        textAlign:'right',
        borderColor:'#c6c6c7',
        borderBottomWidth:1,
        color:'#222'
    },
    Text:{
        padding:5,
        fontFamily:global.fontFamily,
        fontSize:global.fontSize12,
        color:'#222',
    }
});
