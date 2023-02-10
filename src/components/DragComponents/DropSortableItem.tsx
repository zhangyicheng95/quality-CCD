import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { DropTarget } from 'react-dnd';

const ItemTypes = {
  CARD: 'card',
};

//拖拽目标
const cardTarget = {
  drop(props: any, monitor: any, component: any) {
    if (!component) {
      return null;
    }

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    // @ts-ignore
    const hoverBoundingRect = findDOMNode(component)?.getBoundingClientRect() || null;
    const hoverMiddleY = hoverBoundingRect.bottom - hoverBoundingRect.top;
    const clientOffset = monitor.getClientOffset();

    const hoverClientY = clientOffset?.y - hoverBoundingRect?.top;
    /* if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    } */

    props.moveCard(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  },
};

class SortableItem extends React.Component {
  render() {
    // @ts-ignore
    const { connectDropTarget, children } = this.props;
    return connectDropTarget && connectDropTarget(children);
  }
}

export default DropTarget(ItemTypes.CARD, cardTarget, (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
  };
})(SortableItem);
