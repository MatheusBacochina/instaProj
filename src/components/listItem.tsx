import { useEffect } from "react";
import { Text, View, ImageBackground, Image } from "react-native";
import { PostStyle } from "../styles/postsStyles";

export function ListItem({ datas, style, props }: any) {
  return (
    <PostStyle>
      <View
        style={{
          zIndex: 10,
          width: "100%",
          height: 40,
          position: "absolute",
          justifyContent: "center",
          
        }}
      >
        <Image
          style={{
            width: 60,
            height: 60,
            borderRadius: 100,
            position: "absolute",
            top: 16,
            left: 16,
          }}
          source={{ uri: datas.item.userUrl }}
        ></Image>
        <Text style={{ color: "white", marginLeft: 80, top: 20 }}>
          {datas.item.autor}
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          height: 30,
          backgroundColor: "#0e0e0e86",
          position: "absolute",
          zIndex: 11,
          bottom: 25,
          justifyContent: "center",
          alignItems: "center",
        
        }}
      >
        <Text style={{ fontSize: 20, color: 'white', textAlign: 'center' }}>
          {datas.item.coment}
        </Text>
      </View>
      <ImageBackground
        style={{ width: "100%", height: 400, position: "absolute" }}
        resizeMode="cover"
        source={{ uri: datas.item.url }}
      ></ImageBackground>
    </PostStyle>
  );
}
