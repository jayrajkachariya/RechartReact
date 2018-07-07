import React, {Component} from 'react';
import './Chart.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Line, LineChart, Pie, PieChart } from 'recharts';

// To load bar charts for now, we can add any types of charts, according to need by importing from 'recharts'
class ChartRow extends Component {
    constructor(props) {
        super(props);
        this.getRandomColor = this.getRandomColor.bind(this);
    }

    // To select color from these 10 selected colors
    getRandomColor = (i) => {
        let color = ['#890067',
            '#008394',
            '#908700',
            '#002370',
            '#804502',
            '#018040',
            '#f00900',
            '#0f0f0f',
            '#23a4a8',
            '#950000'];
        return color[i%10];
    };

    render(){
        return (
            <div className="centerClass">
                {(this.props.Fields.length === 1)
                    ?   <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={this.props.data}>
                                <XAxis dataKey={this.props.X_Field.toString()}/>
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <CartesianGrid strokeDasharray="3 3"/>
                                <Tooltip cursor={false}/>
                                <Legend />
                                {this.props.Fields.map((field, i) => <Bar yAxisId="left" key={i} dataKey={field.toString()} fill={this.getRandomColor(i)}/>)}
                            </BarChart>
                        </ResponsiveContainer>
                    : <div></div>}
                {(this.props.Fields.length >= 2)
                    ?   <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={this.props.data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey={this.props.X_Field.toString()}/>
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                {this.props.Fields.map((field, i) => <Line yAxisId="left" key={i} dataKey={field.toString()} stroke={this.getRandomColor(i)}/>)}
                            </LineChart>
                        </ResponsiveContainer>
                    : <div></div>}
            </div>
        )
    }
}

export default ChartRow;