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
                {(this.props.keyX.length) ?
                    <div>
                        <h6>Select column for X-Axis <span>(You can select Only One)</span></h6>
                        <div>
                            {this.props.keyX.map((KEY, i) =>
                                <button key={i}
                                        onClick={ () => this.props.updateXHeaders(KEY)}
                                        className={this.numberXClassName(KEY)}>{KEY}</button>)}
                        </div>
                    </div> :
                    <div></div>
                }
                {(this.props.X === '') ?
                    <div></div> :
                    <div>
                        <h6>Select column for Y-Axis <span>(You can select Multiple)</span></h6>
                        <div>
                            {this.props.keyY.map((KEY, i) =>
                                <button key={i}
                                        onClick={() => this.props.updateHeaders(KEY)}
                                        className={this.numberClassName(KEY)}>{KEY}</button>)}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

// Main Core Component for all the updates and parsing
class CommonComponent extends Component {

    state = {
        availableFields: [],
        allowedFieldsX: [],
        allowedFieldsY: [],
        data: [],
        Y_Fields: [],
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
        this.setState({  // Nullify when new data arrives
            availableFields: [],
            allowedFieldsX: [],
            allowedFieldsY: [],
            Y_Fields: [],
            X_Field: ''
        });
        let temp = Object.keys(data[0]);
        temp.forEach(key => {
            if (!isNaN(data[0][key])) {
                this.setState(prevState => ({
                    availableFields: [...prevState.availableFields, key], // Save allowed Number typo fields available for all
                    allowedFieldsX: [...prevState.allowedFieldsX, key],  // Shows allowed Number typo fields available on X
                    allowedFieldsY: [...prevState.allowedFieldsY, key]  // Shows allowed Number typo fields available on Y
                }));
            }
        });
        this.setState({data}); // Update state for data
    };


    // Update for Y axis
    updateHeaders = (key) => {
        let index = this.state.Y_Fields.indexOf(key);
        if ( index >= 0) {
            this.setState(prevState => ({
                Y_Fields: update(prevState.Y_Fields, {$splice: [[index, 1]]})
            }))
        } else {
            this.setState(prevState => ({
                Y_Fields: [...prevState.Y_Fields, key]
            }));
        }
    };

    // Update for X axis
    updateXHeaders = (key) => {
        if (this.state.allowedFieldsY.indexOf(key) >=0 ) {
            this.setState({
                allowedFieldsY:
                (this.state.X_Field === '') ?
                    update (this.state.allowedFieldsY, {
                        $splice: [[this.state.allowedFieldsY.indexOf(key.toString()), 1]]
                    }) :
                    update (
                        update (this.state.allowedFieldsY, {
                            $splice: [[this.state.allowedFieldsY.indexOf(key.toString()), 1]]
                        }), {$push: [this.state.X_Field.toString()]}
                        )
                ,
                X_Field: key
            });
        }
        if ( this.state.Y_Fields.indexOf(key.toString()) >= 0) {
            this.setState({
                Y_Fields: update(this.state.Y_Fields, { $splice: [[this.state.Y_Fields.indexOf(key.toString()), 1]]}),
                X_Field: key
            });
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
                        <SelectHeaders data={this.state.data}
                                       X={this.state.X_Field}
                                       Y={this.state.Y_Fields}
                                       keyX={this.state.allowedFieldsX}
                                       keyY={this.state.allowedFieldsY}
                                       updateHeaders={this.updateHeaders}
                                       updateXHeaders={this.updateXHeaders}/>
                    </div>
                    <div className="GridChild" style={{height: 'auto'}}>
                        <ChartDrow data={this.state.data} Fields={this.state.Y_Fields} X_Field={this.state.X_Field}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default CommonComponent;




