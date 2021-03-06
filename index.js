import React, {Component, PureComponent} from 'react';
import { ScrollView, View, Text } from 'react-native';
import PropTypes from 'prop-types';

let ALERT_MSG = '';
const _alert = (msg)=>{
	// dev debug
	// console.info(msg)

	// prod debug
	// ALERT_MSG = ALERT_MSG + '\n' + msg;
	// alert(ALERT_MSG)
}

export class Anchor extends PureComponent {
	render(){
		return (
				this.props.children
		)
	}
}

class AnchorItemWrapper extends PureComponent{
	_handleLayout(event){
		const anchorOffset = this.props.scrollViewLayoutHeight/2;
		const itemsOffset = event.nativeEvent.layout.height/2;
		const top = event.nativeEvent.layout.y - anchorOffset + itemsOffset;
		_alert(`AnchorItemWrapper._handleLayout: Y ${event.nativeEvent.layout.y}, anchorOffset ${anchorOffset}, itemOffset ${itemsOffset}, top ${top}`)
		this.props.setAnchors(top);
		this.props.setItems(top, this.props.children);
		if(this.props.children.props.focus){
			this.props.setInitMove(top)
		}
	}
	render(){
		return (
			<View
				onLayout={this._handleLayout.bind(this)}
			>
			{this.props.children}
			</View>
		)
	}
}
class	AnchorItemWrappedList extends Component{
	constructor(props){
		super(props);
		this.state={
			anchorItems:null
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.scrollViewLayoutHeight != this.props.scrollViewLayoutHeight){
			this.setState({
				anchorItems: this._renderItems.call(this,nextProps.scrollViewLayoutHeight)
			});
		}
	}
	_renderItems(scrollViewLayoutHeight){
		const res = [];
		const items = this.props.children;
		for(let i =0; i < items.length; i++){
			let child = items[i];
			let index = i;

			if(child.map){
				res.push(
					<AnchorItemWrappedList
				    key={`aiw${this.props.prefix}_${index}`}
					  prefix={this.props.prefix + 'Child'}
						setAnchors={(y)=>this.props.setAnchors(y)}
						setInitMove={(y)=>this.props.setInitMove(y)}
						setItems={(y, anchro)=>this.props.setItems(y, anchro)}
						scrollViewLayoutHeight={scrollViewLayoutHeight}
					>
						{child}
					</AnchorItemWrappedList>
				);
			}else{
				_alert(`AnchorItemWrapperList.child: ${child}/${child.type}/${child.type.name}/${child.type.displayName}`)
				// if(child.type && child.type.displayName && child.type.displayName === "Anchor"){
					res.push(
						<AnchorItemWrapper
				      key={`aiw${this.props.prefix}_${index}`}
							setAnchors={(y)=>this.props.setAnchors(y)}
							setInitMove={(y)=>this.props.setInitMove(y)}
							setItems={(y, anchro)=>this.props.setItems(y, anchro)}
							scrollViewLayoutHeight={scrollViewLayoutHeight}
						>
						{child}
						</AnchorItemWrapper>
					);
				// }else{
				// 	res.push(child) ;
				// }
			}
		}
		return res;
	}
	render(){
		return (
				<View
					onLayout={(event)=>{
							this.props.setChildrenLayoutHeight && this.props.setChildrenLayoutHeight(event.nativeEvent.layout.height);
					}}
				>
					{this.state.anchorItems}
				</View>
		)
	}
}

class AutoAlignScrollView extends Component {

	constructor(props){
		super(props);
		this.anchors=[];
		this.items={};
		this.childrenLayoutHeight=0;
		// this.scrollViewLayoutHeight=0;
		this.initMove=0
		this.state={
			wrappedItem:null,
			scrollViewLayoutHeight:0
		}
	}
	componentDidMount(){
		if(this.initMove){
			this.sv && this.sv.scrollTo({x: 0, y: this.initMove, animated: false});
		}
	}
  _calAlign(offsetY){
		if(this.anchors && this.anchors.reduce){
			const focusedItem = {};
			const move = this.anchors.reduce((sum, anchro, index)=>{
				const diff = anchro - offsetY;
				_alert(`_calAlign ${anchro} to ${offsetY} is ${diff} and sum is ${sum}, index ${index}`)
				if( Math.abs(sum) < Math.abs(diff)){
					return sum;
				}else{
					focusedItem = this.items[anchro];
					return diff
				}
			},this.childrenLayoutHeight)
			return {
				move,
				focusedItem
			};
		}
		return {
			move:0,
			focusedItem:{}
		};
	}
	render(){
		return (
			<ScrollView
				ref={(sv) => this.sv=sv}
				onLayout={(event)=>{
					// this.scrollViewLayoutHeight=event.nativeEvent.layout.height;
					_alert(`onlayout ${event.nativeEvent.layout.height}`);
					this.anchors=[];
					this.setState({
						// wrappedItem: this._anchorItemWapper.call(this,[this.props.children]),
						scrollViewLayoutHeight: event.nativeEvent.layout.height
					})
				}}
				onScrollEndDrag={(event)=>{
					_alert('scrolling end', event.nativeEvent.contentOffset.y);
					const offsetY = event.nativeEvent.contentOffset.y;
					const { move, focusedItem} = this._calAlign(offsetY);
					const focusOn = offsetY + move;
					this.sv && this.sv.scrollTo({x: 0, y: focusOn, animated: true});
					if(focusedItem && focusedItem.props && focusedItem.props.onFocus){
						focusedItem.props.onFocus();
					}
				}}
				{...this.props}
			>
				{/* <View
					onLayout={(event)=>{
							this.childrenLayoutHeight=event.nativeEvent.layout.height;
					}}
				> */}
						{/* {this.state.wrappedItem} */}
					<AnchorItemWrappedList
					  prefix={''}
						setAnchors={(y)=>this.anchors.push(y)}
						setInitMove={(y)=>{
							_alert('setInitMove',y);
							this.sv && this.sv.scrollTo({x: 0, y, animated: false});
						}}
						setItems={(y, anchro)=>this.items[y]=anchro}
						scrollViewLayoutHeight={this.state.scrollViewLayoutHeight}
						setChildrenLayoutHeight={(height)=>{
								this.childrenLayoutHeight=height;
						}}
					>
						{this.props.children}
					</AnchorItemWrappedList>
				{/* </View> */}
			</ScrollView>
		)
	}

}

AutoAlignScrollView.propTypes={
	// alignTo:PropTypes.oneOf['top','middle', 'buttom']
}

export default AutoAlignScrollView;
