React Native Auto Align ScrollView
====

[![npm](https://img.shields.io/npm/v/react-native-auto-align-scrollview.svg?style=flat-square)](https://www.npmjs.com/package/react-native-auto-align-scrollview)


`react-native-auto-align-scrollview` is used to create simple auto align list view, such as data picker,  data selector. You can also try use it in content list view, to the content always align to the center of list.

# Demo
![2018-04-18 23.31.17](https://github.com/yanqiw/react-native-auto-align-scrollview/blob/master/docs/2018-04-18%2023.31.17.gif?raw=true)
# Installation
```bash
npm install --save react-native-auto-align-scrollview
```

# How to use it

### Wrap the item by `Ancher`

Wrap the item which need to be focused.
|  props | type | usage |
|---|---|---|
|  focus | boolean | the init focus item. (option) |
|  onFocus | function | the callback function when the item is focused |

```javascript
// import the paackage at the top of your component file
import AutoAlignScrollView, {
  Anchor
} from "react-native-auto-align-scrollview";

// ... in component
  _renderOption() {
    const that = this;
    const opt = [5,10,15,20,30].map((row, i) => {
      return (
        <Anchor
					key={`anchor_${i}`}
					focus={ row === 15 }
          onFocus={function() {
						// do the onfocus login, pls notice that you need to handle the index by yourself. such as below:
            this.setState({
              duration: row
            });
          }.bind(that)}
        >
          <View
            style={{
              minHeight: 35,
              justifyContent: "center"
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#FFFFFF",
                textAlign: "center",
                backgroundColor: "rgba(0,0,0,0)"
              }}
              key={i}
            >{`${row}`}</Text>
          </View>
        </Anchor>
      );
    });
    return opt;
  }
```

### Use the `AutoAlignScrollView`

`AutoAlignScrollView` support all the scrollview props.

```javascript
//... in render function

<AutoAlignScrollView
	ref={ref => (this.timer = ref)}
	showsVerticalScrollIndicator={false}
	automaticallyAdjustContentInsets={false}
	horizontal={false}
	style={{
		backgroundColor: "rgba(0,0,0,0)",
		width: 30,
		height: 110
	}}
>
	{this._renderOption()}
</AutoAlignScrollView>
```

# Todo
- Test in Android
- Add align to `top`, `bottom`
