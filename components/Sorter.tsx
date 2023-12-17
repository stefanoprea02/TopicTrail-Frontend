import React, { useContext } from "react";
import { ListRenderItemInfo } from "react-native";

import {
  FlatList,
  Animated,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";
import HomePost from "../components/HomePost";
import SortBar from "../components/SortBar";
import PostModal from "./PostModal";

interface SorterProps {
  posts: Post[];
  setAux?: (boolean) => void;
}

export default function Sorter(props: SorterProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [sortByTitleAscending, setSortByTitleAscending] = React.useState(true);
  const [sortByDateAscending, setSortByDateAscending] = React.useState(true);
  const [selectedPost, setSelectedPost] = React.useState<Post>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (props.setAux) props.setAux((prev) => !prev);
    setIsRefreshing(false);
  };

  const renderPost = (listItem: ListRenderItemInfo<Post>) => {
    return (
      <TouchableWithoutFeedback onPress={() => setSelectedPost(listItem.item)}>
        <Animated.View>
          <HomePost
            title={listItem.item.title}
            content={listItem.item.content}
            postCreatedAt={listItem.item.postCreatedAt}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  const handleSortByTitle = () => {
    setSortByTitleAscending(!sortByTitleAscending);
  };
  const handleSortByDate = () => {
    setSortByDateAscending(!sortByDateAscending);
  };

  const sortedPosts = props.posts
    .sort((a, b) => {
      if (sortByTitleAscending) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    })
    .sort((a, b) => {
      const aDate = new Date(
        a.postCreatedAt[0],
        a.postCreatedAt[1] - 1,
        a.postCreatedAt[2]
      ).valueOf();
      const bDate = new Date(
        b.postCreatedAt[0],
        b.postCreatedAt[1] - 1,
        b.postCreatedAt[2]
      ).valueOf();
      if (sortByDateAscending) {
        return aDate - bDate;
      } else {
        return bDate - aDate;
      }
    });

  return (
    <>
      <SortBar
        handleSortByTitle={handleSortByTitle}
        handleSortByDate={handleSortByDate}
        sortByTitleAscending={sortByTitleAscending}
        sortByDateAscending={sortByDateAscending}
      />
      {sortedPosts && (
        <FlatList
          data={sortedPosts}
          renderItem={(item) => renderPost(item)}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      )}

      <PostModal
        hideModal={() => setSelectedPost(null)}
        selectedPost={selectedPost}
      />
    </>
  );
}
