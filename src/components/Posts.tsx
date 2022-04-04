import { Text } from "react-native";
import { FlatList } from "react-native";
import { ListItem } from "./listItem";
import { MyContext } from "../context/api";
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
export const Posts = forwardRef(({posts}: any, ref: any) => {

  const a = useState();
  return (
    <FlatList
      ref={ref}
      style={{ width: "100%", 
    }}
      data={posts}
      renderItem={(item) => (
        <ListItem
          onLayout={(e: any) => a[1](e)}
          datas={item}
        />
      )}
    ></FlatList>
  );
});
