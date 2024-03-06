import React, { Component, MouseEvent } from 'react';
import AntdModal, { ModalProps } from 'antd/lib/modal';
import 'antd/es/modal/style/index.css';

class AntDraggableModal extends Component<ModalProps> {
  private simpleClass: string;
  private header: any;
  private contain: any;
  private modalContent: any;
  private mouseDownX: number = 0;
  private mouseDownY: number = 0;
  private deltaX: number = 0;
  private deltaY: number = 0;
  private sumX: number = 0;
  private sumY: number = 0;

  constructor(props: ModalProps) {
    super(props);
    this.simpleClass = Math.random().toString(36).substring(2);
  }

  handleMove = (event: any) => {
    const deltaX = event.pageX - this.mouseDownX;
    const deltaY = event.pageY - this.mouseDownY;

    this.deltaX = deltaX;
    this.deltaY = deltaY;

    this.modalContent.style.transform = `translate(${deltaX + this.sumX}px, ${
      deltaY + this.sumY
    }px)`;
  };

  initialEvent = (visible: boolean) => {
    const { title } = this.props;
    if (title && visible) {
      setTimeout(() => {
        window.removeEventListener('mouseup', this.removeUp, false);

        this.contain = document.getElementsByClassName(this.simpleClass)[0];
        this.header = this.contain.getElementsByClassName('ant-modal-header')[0];
        this.modalContent = this.contain.getElementsByClassName('ant-modal-content')[0];

        this.header.style.cursor = 'all-scroll';
        this.header.onmousedown = (e: MouseEvent<HTMLDivElement>) => {
          this.mouseDownX = e.pageX;
          this.mouseDownY = e.pageY;
          document.body.onselectstart = () => false;
          window.addEventListener('mousemove', this.handleMove, false);
        };

        window.addEventListener('mouseup', this.removeUp, false);
      }, 0);
    }
  };

  removeMove = () => {
    window.removeEventListener('mousemove', this.handleMove, false);
  };

  removeUp = () => {
    document.body.onselectstart = () => true;

    this.sumX = this.sumX + this.deltaX;
    this.sumY = this.sumY + this.deltaY;

    this.removeMove();
  };

  componentDidMount() {
    const { visible = false } = this.props;
    this.initialEvent(visible);
  }

  componentWillUnmount() {
    this.removeMove();
    window.removeEventListener('mouseup', this.removeUp, false);
  }

  render() {
    const { children, wrapClassName, ...other } = this.props;
    const wrapModalClassName = wrapClassName
      ? `${wrapClassName} ${this.simpleClass}`
      : `${this.simpleClass}`;
    return (
      <AntdModal {...other} wrapClassName={wrapModalClassName}>
        {children}
      </AntdModal>
    );
  }
}

export default AntDraggableModal;
