import React from "react";
import Paper from '@material-ui/core/Paper';
import {
    SelectionState,
    PagingState,
    IntegratedPaging,
    IntegratedSelection,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableSelection,
    PagingPanel,
} from '@devexpress/dx-react-grid-material-ui';

export default class XYTable extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            columns: [
                { name: 'x', title: 'x' },
                { name: 'y', title: 'y' },
                { name: 'type', title: 'Type' }
            ],
            rows: [
                { x: '1', y: '1', type: 'rel' }
            ],
            selection: [],
        };

        this.changeSelection = selection => this.setState({ selection });
    }

    render() {
        let { rows, columns, selection } = this.state;
        return (
            <div>
                <Paper>
                    <Grid
                        rows={rows}
                        columns={columns}
                    >
                        <PagingState
                            defaultCurrentPage={0}
                            pageSize={6}
                        />
                        <SelectionState
                            selection={selection}
                            onSelectionChange={this.changeSelection}
                        />
                        <IntegratedPaging />
                        <IntegratedSelection />
                        <Table />
                        <TableHeaderRow />
                        <TableSelection showSelectAll />
                        <PagingPanel />
                    </Grid>
                </Paper>
            </div>
        );
    }
}