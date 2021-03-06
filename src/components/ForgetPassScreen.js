import React from 'react';
import {View,StatusBar,ActivityIndicator,TouchableOpacity,Platform,TextInput, Text,Animated,Image, StyleSheet, I18nManager} from 'react-native';
import './global'
import Toast from "./SimpleToast";
export default class ConfirmationScreen extends React.Component {

    constructor(props){
        super(props)
        this.state={
            username:'',loading:false
        }
        this.Forget=this.Forget.bind(this)
    }

    ChangeUsername(text){
        this.setState({username:text.trim()})
    }

    async Forget()
    {
        try {

            let ResetAddress = global.ApiAddress + "/user/reset-password-request";
            if (this.state.username == '') {
                Toast.showWithGravity('شماره موبایل خود را وارد کنید', Toast.LONG, Toast.CENTER)
                this.setState({loading:false})
            }
            else {
                this.setState({loading:true})
                var formData = new FormData();
                formData.append('username', this.state.username)
                let response = await fetch(ResetAddress, {
                    method: 'POST',
                    headers: {},
                    body: formData
                });
                let Data = await response.json();
                if (Data.data.status == "success") {
                    this.setState({loading:false})
                    this.props.navigation.navigate('CheckToken', {
                        username: this.state.username,
                        RouteName:this.props.navigation.state.params.RouteName
                    })
                }
                else if (Data.data.status == "fail") {
                    if (Data.data.message == "username is incorrect") {
                        this.setState({loading:false})
                        Toast.showWithGravity('شماره موبایل وارد شده صحیح نمی باشد', Toast.LONG, Toast.CENTER)
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
                        <Text style={styles.HeaderTitle}>فراموشی رمز عبور</Text>
                        <Image source={require('.././images/ForgetPass.png')}
                               style={styles.Logo}
                        />
                    </View>
                    <View style={styles.Bottom}>

                        <TextInput onChangeText={this.ChangeUsername.bind(this)} maxLength = {11} keyboardType={'phone-pad'} autoFocus = {true} style={styles.TextInput} underlineColorAndroid={'transparent'}
                                   placeholder={'شماره موبایل'}  placeholderTextColor={global.Gray2}
                        />

                        {
                            this.state.loading ?
                                <View style={styles.DisableBtn}>
                                    <ActivityIndicator size="small" color="#515151"/>
                                    <Text style={styles.ButtonText}>ارسال کد</Text>

                                </View>
                                :
                                <TouchableOpacity onPress={()=>this.Forget()} activeOpacity={.7} style={styles.RegisterBtn}>
                                    <Text style={styles.ButtonText}>ارسال کد</Text>
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
    ButtonText:{
        fontFamily:'IRANSansMobile',
        fontSize:12,
        color:global.White1
    },
    TextInput:{
        borderRadius:5,
        margin:5,
        fontSize:12,
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
        fontSize:12,
        color:'#222',
    }
});
