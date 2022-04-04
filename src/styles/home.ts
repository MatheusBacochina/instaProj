import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { StatusBar} from 'react-native';


const marginStatusBar: number | any = StatusBar.currentHeight;


const wd = Dimensions.get('window').width
const hg = (Dimensions.get('window').height)

export const Styles = StyleSheet.create({
    App:{
        flex: 1,
        width: wd,
        height: hg,
        backgroundColor: '#CEB7FF',
        alignItems: 'center',
    },
    Nav:{
        width: '100%',
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 4,
        backgroundColor: '#9681d9'
    },
    Logo:{
        marginTop: 10,
        resizeMode: 'contain',
        width: 70,
        height: 60,
        marginLeft: 30
    },
    addStyle: {
        width: '100%',
        height: '100%',
        backgroundColor: '#987ED1',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'    
    }

    
})