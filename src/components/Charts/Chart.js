import React, {Component} from 'react';
import './Chart.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
// import {Line, LineChart, PieChart, Pie} from 'recharts';

// To load bar charts for now, we can add any types of charts, according to need by importing from 'recharts'
class ChartRow extends Component {
    constructor(props) {
        super(props);
        this.getRandomColor = this.getRandomColor.bind(this);
    }

    // To select color from these 10 selected colors
    getRandomColor = (i) => {
        let color = ['#897067','#458394','#908754','#902376','#874532','#018945','#348967','#027485','#873598','#957300',];
        return color[i%10];
    };

    render(){
        return (
            <div className="centerClass">
                <ResponsiveContainer width="100%" height={300}>
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
            </div>
        )
    }
}

export default ChartRow;