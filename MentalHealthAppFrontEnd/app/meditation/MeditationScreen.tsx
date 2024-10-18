import React from "react";
import Carousel from "react-native-reanimated-carousel";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import { Button, Text, View } from "react-native";

const data = [
    {
      title: "Slide 1",
      content: "Slide 1 Content",
    },
    {
      title: "Slide 2",
      content: "Slide 2 Content",
    },
    {
      title: "Slide 3",
      content: "Slide 3 Content",
    },
  ];
 
  
export default function MeditationScreen() {
    const ref = React.useRef<ICarouselInstance>(null); // 2. Create a ref for the Carousel component
  return (
    <View>
      {/* 3. Add the Carousel component with the ref */}
      <Carousel
        ref={ref}
        data={data}
        width={300} // 4. Add the required "width" prop
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
      {/* 5. Add a button to trigger the next slide */}
      <Button
        title="Next"
        onPress={() => {
          ref.current?.next(); // 6. Call the "next" method on the ref
        }}
      />
    </View>
  );

}