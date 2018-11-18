import React from "react";
import Paper from '@material-ui/core/Paper';
import {
    SelectionState,
    PagingState,
    IntegratedPaging,
    IntegratedSelection,
    SortingState,
    IntegratedSorting,
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
            rows: [],
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
                        <SortingState defaultSorting={[{ columnName: "x", direction: "asc" }]} />
                        <IntegratedSorting />
                        <IntegratedPaging />
                        <IntegratedSelection />
                        <Table />
                        <TableHeaderRow showSortingControls/>
                        <TableSelection showSelectAll />
                        <PagingPanel />
                    </Grid>
                </Paper>
            </div>
        );
    }

    refresh(_){
        // this.state.rows = [
        //     { x: '1', y: '1', type: 'rel' },
        //     { x: '4', y: '2', type: 'rel' },
        //     { x: '5', y: '3', type: 'rel' },
        //     { x: '5', y: '3', type: 'rel' },
        //     { x: '5', y: '3', type: 'rel' },
        //     { x: '5', y: '3', type: 'rel' },
        //     { x: '6', y: '4', type: 'inf' },
        //     { x: '2', y: '5', type: 'inf' },
        //     { x: '6', y: '4', type: 'inf' },
        //     { x: '2', y: '5', type: 'inf' },
        //     { x: '6', y: '4', type: 'inf' },
        //     { x: '2', y: '5', type: 'inf' },
        //     { x: '6', y: '4', type: 'inf' },
        //     { x: '2', y: '5', type: 'inf' },
        //     { x: '3', y: '7', type: 'hole' }
        // ];

        this.state.rows = _;
        this.forceUpdate();
    }
}