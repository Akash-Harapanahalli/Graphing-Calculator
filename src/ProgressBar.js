import React from "react";
import LinearProgress from "@material-ui/core/LinearProgress";

export default class ProgressBar extends React.Component {
    constructor(props){
        super(props);
        this.progress = 0;
    }
    setProgress(_){
        this.progress = _;
        this.forceUpdate();
    }
    render(){
        return (
            <div>
                <LinearProgress variant="determinate" value={this.progress}/>
            </div>
        );
    }

}