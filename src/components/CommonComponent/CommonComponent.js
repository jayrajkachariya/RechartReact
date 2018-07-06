import React, { Component } from 'react';
import Papa from 'papaparse';
import './CommonComponent.css';
import TableComponent from "../TableComponent/TableComponent";
import ChartDrow from "../Charts/Chart";
import update from 'immutability-helper';

// To load .csv file, parse it through Papa.parse and getting JSON
class Form extends Component {
    constructor(props) {
        super(props);
        this.parseFile = this.parseFile.bind(this);
    }

    // Parse file
    parseFile(file) {
        Papa.parse(file, {
            header: true,
            download: true,
            skipEmptyLines: true,
            complete: this.props.onDataChange
        });
    };

    render() {
        return(
            <div style={{padding: '5px'}}>
                <span>Choose .CSV File &nbsp;</span>
                <input style={{display: 'inlineBlock'}} type="file" accept=".csv" onChange={ event => {
                    this.parseFile(event.target.files[0])
                }}/>
            </div>
        )
    }
}

// To give options for X and Y axis with available number typed column from .csv
class SelectHeaders extends Component {

    constructor(props) {
        super(props);
        this.numberClassName = this.numberClassName.bind(this);
        this.numberXClassName = this.numberXClassName.bind(this);
    }

    // For buttons of Y axis
    numberClassName = (key) => {
        if (this.props.Y.indexOf(key) >= 0) {
            return 'selected';
        } else
            return 'notSelected';
    };

    // For buttons of X axis
    numberXClassName = (key) => {
        if (this.props.X === key) {
            return 'Dselected';
        } else
            return 'notSelected';
    };

    render() {
        return (
            <div className="grid">
                <div>
                    <h6>Select column for X-Axis <span>(You can select Only One)</span></h6>
                    <div>
                        {this.props.keys.map((KEY, i) =>
                            <button key={i}
                                    onClick={ () => this.props.updateXHeaders(KEY)}
                                    className={this.numberXClassName(KEY)}>{KEY}</button>)}
                    </div>
                </div>
                <div>
                    <h6>Select column for Y-Axis <span>(You can select Multiple)</span></h6>
                    <div>
                        {this.props.keys.map((KEY, i) =>
                            <button key={i}
                                    onClick={ () => this.props.updateHeaders(KEY)}
                                    className={this.numberClassName(KEY)}>{KEY}</button>)}
                    </div>
                </div>
            </div>
        )
    }
}

// Main Core Component for all the updates and parsing
class CommonComponent extends Component {

    state = {
        allowedFields: [],
        data: [],
        Fields: [],
        X_Field: ''
    };

    constructor(props) {
        super(props);
        this.updateData = this.updateData.bind(this);
        this.updateHeaders = this.updateHeaders.bind(this);
        this.updateXHeaders = this.updateXHeaders.bind(this);
    }

    // Update data for table and graph once loaded as JSON from Papa.parse..
    updateData = (result) => {
        let data = result.data.map(item => {
                const keys = Object.keys(item);
                let newObj={};
                keys.map(m => newObj[m] = (!isNaN(item[m])) ? (parseInt(item[m])) : (item[m]));
                return newObj;
            });
        let temp = Object.keys(data[0]);
        temp.forEach(key => {
            if (!isNaN(data[0][key])) {
                this.setState(prevState => ({
                    allowedFields: [...prevState.allowedFields, key]  // Shows allowed Number typo fields available
                }));
            }
        });
        this.setState({data}); // Update state for data
    };


    // Update for Y axis
    updateHeaders = (key) => {
        let index = this.state.Fields.indexOf(key);
        if ( index >= 0) {
            this.setState(prevState => ({
                Fields: update(prevState.Fields, {$splice: [[index, 1]]})
            }))
        } else {
            this.setState(prevState => ({
                Fields: [...prevState.Fields, key]
            }));
        }
    };

    // Update for X axis
    updateXHeaders = (key) => {
        let index = this.state.Fields.indexOf(key);
        if ( index >= 0) {
            this.setState(prevState => ({
                Fields: update(prevState.Fields, {$splice: [[index, 1]]}),
                X_Field: update(prevState.X_Field, {$set: key})
            }))
        } else {
            this.setState(prevState => ({
                X_Field: update(prevState.X_Field, {$set: key})
            }));
        }
    };

    render() {
        return (
            <div>
                <Form onDataChange={this.updateData}/>
                <div className="GridArea">
                    <div className="GridChild">
                        <TableComponent data={this.state.data}/>
                    </div>
                    <div>
                        <SelectHeaders data={this.state.data} X={this.state.X_Field}  Y={this.state.Fields} updateHeaders={this.updateHeaders} updateXHeaders={this.updateXHeaders} keys={this.state.allowedFields}/>
                    </div>
                    <div className="GridChild" style={{height: 'auto'}}>
                        <ChartDrow data={this.state.data} Fields={this.state.Fields} X_Field={this.state.X_Field}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommonComponent;




