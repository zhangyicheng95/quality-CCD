import * as React from 'react';

import {
	DragSource,
} from 'react-dnd';

const ItemTypes = {
	CARD: 'card'
};

const style = {
	border: '1px dashed gray',
	padding: '0.5rem 1rem',
	marginBottom: '.5rem',
	backgroundColor: 'white',
	cursor: 'move',
};

//拖拽源
const cardSource = {
	beginDrag(props: any) {
		return {
			index: props.index,
			name: props.name
		};
	}
};

class SortableItem extends React.Component {
	render() {
		// @ts-ignore
		const { connectDragSource, children } = this.props;
		return (
			connectDragSource &&
			connectDragSource(
				children
			)
		);
	}
}

export default DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	};
})(SortableItem);
