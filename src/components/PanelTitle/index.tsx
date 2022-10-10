import './index.less'

const PanelTitle: React.FC = ({children}) => {
    return (
        <div className="component-panel-title">
            <div className="bar left" />
            <div className="icon" />
            <div className="text">{children}</div>
            <div className="icon" />
            <div className="bar right" />
        </div>
    )
}

export default PanelTitle
