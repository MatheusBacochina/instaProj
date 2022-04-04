import {
  LayoutChangeEvent,
  View,
  ScrollView,
  Text,
  PanResponder,
  Button,
} from "react-native";
import { Mensages } from "./mensages";
import { useEffect, useRef, useState } from "react";
import { ContextProvider, MyContext } from "../context/api";
import { Dimensions } from "react-native";
import { Users } from "../pages/camera";
import { Feed } from "../pages/feed";
import { Styles } from "../styles/home";
import { useContext } from "react";
import { Login } from "./login";
import {
  query,
  where,
  collection,
  doc,
  setDoc,
  getFirestore,
  getDocs,
} from "firebase/firestore";

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView | null>(null);
  const positions = useState<null | any>([null, null, null]);
  const width = useState(0);
  const scrollWidth = useState<number | null>(0);
  const wd = Dimensions.get("window").width;
  const { currentUser } = useContext(MyContext);
  const db = getFirestore();
  const canScroll = useState<any>(true);


  useEffect(() => {}, []);

  return currentUser ? (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      ref={scrollRef}
      onLayout={(event) => {
        const { x, y, height, width } = event.nativeEvent.layout;
        scrollWidth[1](width - wd);
        scrollRef.current?.scrollTo({ x: wd, animated: true });
      }}
      snapToAlignment={"center"}
      snapToInterval={wd}
      horizontal={true}
      scrollEnabled={canScroll[0]}
      decelerationRate={50}
      style={{
        flex: 1,

        flexDirection: "row",
      }}
    >
      <Users
        props={{
          style: [Styles.App],
          onLayout: (e: LayoutChangeEvent) => {
            let event = e.nativeEvent;
            positions[1]((prev: number[]) => [
              event.layout.x,
              ...prev.slice(1, prev.length),
            ]);
            width[1](e.nativeEvent?.layout?.width);
          },
        }}
      ></Users>
      <Feed
        canScroll={canScroll}
        scrollWidthRef={scrollWidth[0]}
        refScroll={scrollRef}
        props={{
          style: [Styles.App, { marginTop: 0, paddingBottom: 60, }],
          onLayout: (e: LayoutChangeEvent) => {
            let event = e.nativeEvent;
            positions[1]((prev: number[]) => [
              ...prev.slice(0, 1),
              event.layout.x,
              ...prev.slice(2, prev.length),
            ]);
          },
        }}
      ></Feed>
      <View
        onLayout={(e: LayoutChangeEvent) => {
          let event = e.nativeEvent;
          positions[1]((prev: number[]) => [
            ...prev.slice(0, 2),
            event.layout.x,
          ]);
        }}
        style={Styles.App}
      >
        <Mensages />
      </View>
    </ScrollView>
  ) : (
    <Login />
  );
}
