
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/src/Page/AnnotationLayer.css';
import React, { PureComponent } from 'react';
import { Spin, Tooltip, Input } from 'antd';
import { LeftOutlined, RightOutlined ,ZoomInOutlined,ZoomOutOutlined,FullscreenOutlined} from '@ant-design/icons';
import styles from './index.less';

import './App.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

class File extends PureComponent {
  state = {
    pageNumber: 1,
    pageNumberInput: 1,
    pageNumberFocus: false,
    numPages: 1,
    pageWidth: 600,
    fullscreen: false
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages: numPages })
  }

  lastPage = () => {
    if (this.state.pageNumber === 1) {
      return
    }
    const page = this.state.pageNumber - 1
    this.setState({ pageNumber: page, pageNumberInput: page })
  }
  nextPage = () => {
    if (this.state.pageNumber === this.state.numPages) {
      return
    }
    const page = this.state.pageNumber + 1
    this.setState({ pageNumber: page, pageNumberInput: page })
  }
  onPageNumberFocus = e => {
    this.setState({ pageNumberFocus: true })
  };
  onPageNumberBlur = e => {
    this.setState({ pageNumberFocus: false, pageNumberInput: this.state.pageNumber })
  };
  onPageNumberChange = e => {
    let value = e.target.value
    value = value <= 0 ? 1 : value;
    value = value >= this.state.numPages ? this.state.numPages : value;
    this.setState({ pageNumberInput: value })
  };
  toPage = e => {
    this.setState({ pageNumber: Number(e.target.value) })
  };

  pageZoomOut = () => {
    if (this.state.pageWidth <= 600) {
      return
    }
    const pageWidth = this.state.pageWidth * 0.8
    this.setState({ pageWidth: pageWidth })
  }
  pageZoomIn = () => {
    const pageWidth = this.state.pageWidth * 1.2
    this.setState({ pageWidth: pageWidth })
  }

  pageFullscreen = () => {
    if (this.state.fullscreen) {
      this.setState({ fullscreen: false, pageWidth: 600 })
    } else {
      this.setState({ fullscreen: true, pageWidth: window.screen.width - 40 })
    }
  }

  render() {
    const { pageNumber, pageNumberFocus, pageNumberInput, numPages, pageWidth, fullscreen } = this.state;
    return (
      <div className={styles.view}>
        <div className={styles.pageContainer}>
          <Document
            file="https://img.victoryang00.cn/wordpress/wp-content/uploads/2022/03/深造加油站第六期-SOP-杨易为.pdf"
            onLoadSuccess={this.onDocumentLoadSuccess}
            loading={<Spin size="large" />}
          >
            <Page pageNumber={pageNumber} width={pageWidth} loading={<Spin size="large" />} />
          </Document>
        </div>

        <div className={styles.pageTool}>
            <LeftOutlined type="left" onClick={this.lastPage} />
          <Input value={pageNumberFocus ? pageNumberInput : pageNumber}
            onFocus={this.onPageNumberFocus}
            onBlur={this.onPageNumberBlur}
            onChange={this.onPageNumberChange}
            onPressEnter={this.toPage} type="number" /> / {numPages}
            <RightOutlined type="right" onClick={this.nextPage} />
            <ZoomInOutlined type="min" onClick={this.pageZoomIn} />
            <ZoomOutOutlined type="max" onClick={this.pageZoomOut} />
            <FullscreenOutlined type={fullscreen ? "fullscreen-exit" : 'fullscreen'} onClick={this.pageFullscreen} />
        </div>
      </div>
    );
  }
}

export default props => (
  <File {...props} />
);