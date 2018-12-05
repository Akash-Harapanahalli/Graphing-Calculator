import React from "react";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class XY extends React.Component {
	constructor(props){
		super(props);
		this.memes;	
	}	
	render() {
		return (
			<div>
				<Paper children={this.memes}>

				</Paper>
			</div>
		)
	}

	refresh(_){
		let tablerows = [];


		tablerows.push(<TableRow backgroundColor="#ffffff" color="#000000" textSize="100">
							<TableCell>x</TableCell>
							<TableCell>f(x)</TableCell>
							<TableCell>Type</TableCell>
						</TableRow>);
		for(let i = 0; i < 3; i++){
			tablerows.push(<TableRow  key={String(i)}>
								<TableCell>{i}</TableCell>
								<TableCell>f(x)</TableCell>
								<TableCell>Type</TableCell>
							</TableRow>);
		}
		this.memes = <Table> {tablerows} </Table>;
		this.forceUpdate();
	}
}