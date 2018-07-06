import React, { Component } from 'react';
import './TableComponent.css';

// To render rows of table
class TableRows extends Component {
    render() {
        return (
            <tr>
                {this.props.keys.map((Key, i) => <td key={i}>{this.props.data[Key]}</td>)}
            </tr>
        );
    }
}

// To render header and tbody of table
class Table extends Component {
    render() {
        return (
            <table>
                <thead>
                    <tr>
                        {this.props.keys.map((Key, i) => <th key={i}>{Key}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {this.props.data.map((data, i) => <TableRows key={i} keys={this.props.keys} data={data}/>)}
                </tbody>
            </table>
        );
    }
}

// To render table
class TableComponent extends Component {
    render() {
        return (
            <div>
                <Table keys={this.props.data.length > 0 ? Object.keys(this.props.data[0]) : []} data={this.props.data}/>
            </div>
        );
    }
}

export default TableComponent;
