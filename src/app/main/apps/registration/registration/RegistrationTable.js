import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AgGridReact } from 'ag-grid-react';
import { AllModules } from '@ag-grid-enterprise/all-modules';

// import ag-grid css
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import "@ag-grid-enterprise/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-enterprise/all-modules/dist/styles/ag-theme-balham.css";

// import Redux
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';

// import components
import ImageCellRender from '../components/ImageCellRender';

// lazy loading cell renderer
function LoadingRenderer(props) {
    if (props.value !== undefined) {
        return props.value;
    } else {
        return (
            <img src="../assets/images/loading.gif" alt={'loading'} />
        );
    }
}

function RegistrationTable(props) {
    const dispatch = useDispatch();
    const attendees = useSelector(({registerApp}) => registerApp.registration.attendees);
    
    // const allAttendee = useSelector(({ registerApp }) => registerApp.registration.allData);
    // console.log(allAttendee)

    // const columnDefs= [
    //     {
    //         headerName: 'NO',
    //         width: 50,
    //         valueGetter: 'node.id',
    //         cellRenderer: 'loadingRenderer',
    //         // we don't want to sort by the row index, this doesn't make sense as the point
    //         // of the row index is to know the row index in what came back from the server
    //         sortable: false,
    //         suppressMenu: true
    //     },
    //     {headerName: 'ID', field: 'id', cellStyle:() => { return { padding:'15px' };}, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true},
    //     {headerName: 'Category', field: 'category',cellStyle:() => { return { padding:'15px' };}},
    //     {headerName: 'Main Photo', field: 'mainPhoto',cellRenderer: "imageCellRender", filter: false},
    //     {headerName: 'First Name', field: 'firstName',cellStyle:() => { return { padding:'15px' };}},
    //     {headerName: 'Last Name', field: 'lastName',cellStyle:() => { return { padding:'15px' };}},
    //     {headerName: 'Email', field: 'email',cellStyle:() => { return { padding:'15px' };}},
    //     {headerName: 'Company Name', field: 'companyName',cellStyle:() => { return { padding:'15px' };}},
    // ];

    const columnDefs= [
        {headerName: 'ID', field: 'id', cellRenderer: 'loadingRenderer', sortable: false, suppressMenu: true, cellStyle:() => { return { padding:'15px' };}, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true},
        {headerName: 'Category', field: 'category',cellStyle:() => { return { padding:'15px' };}},
        {headerName: 'Main Photo', field: 'mainPhoto',cellRenderer: "imageCellRender", filter: false},
        {headerName: 'First Name', field: 'firstName',cellStyle:() => { return { padding:'15px' };}},
        {headerName: 'Last Name', field: 'lastName',cellStyle:() => { return { padding:'15px' };}},
        {headerName: 'Email', field: 'email',cellStyle:() => { return { padding:'15px' };}},
        {headerName: 'Company Name', field: 'companyName',cellStyle:() => { return { padding:'15px' };}},
    ];

    const rowSelection = "multiple";

    const defs = {
        defaultColDef: {
            resizable: true,
            sortable: true,
            filter: true,
        },
        sideBar: "columns",
        rowData: [],
        modules: AllModules,
        overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>',
        overlayNoRowsTemplate: "<span style=\"padding: 10px; border: 2px solid #444; background: #fafafa;\">Loading ... </span>"
    };

    const rowData = attendees.map((item)=>{
        const temp ={
            id: item.id,
            category: (item.attendeeCategorySAS && item.attendeeCategorySAS[0]) ? item.attendeeCategorySAS[0].categoryName : '',
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            companyName: item.companyName,
        };
        return temp;
    });

    const paginationPageSize = 20;

    const frameworkComponents = {
        loadingRenderer: LoadingRenderer,
        imageCellRender:ImageCellRender,
    };

    const getRowHeight = () => {return 48;};
    const headerHeight = () => {return 32;};
    const onSelectionChanged = (params) => {
        const gridApi = params.api;
        const selectedRow = gridApi.getSelectedRows();
        console.log('here in the row select in registration-ag-grid: ', selectedRow);
        dispatch(Actions.setRow(selectedRow));
    };

    console.log('here inside the registration table: ', attendees);

    return (
        <React.Fragment>
            <div
            className="table-responsive ag-theme-balham"
            style={{height:'100%', width: '100%', fontSize: '16px' }}
            >
                <AgGridReact
                    columnDefs={columnDefs}
                    defaultColDef={defs.defaultColDef}
                    rowSelection = {rowSelection}
                    rowData={rowData}
                    frameworkComponents = {frameworkComponents}
                    // onGridReady={onGridReady}
                    pagination={true}
                    getRowHeight = {getRowHeight}
                    headerHeight = {headerHeight}
                    floatingFilter = {true}
                    overlayLoadingTemplate={defs.overlayLoadingTemplate}
                    overlayNoRowsTemplate={defs.overlayNoRowsTemplate}
                    onSelectionChanged={onSelectionChanged}
                    paginationPageSize={paginationPageSize}
                    >
                </AgGridReact>
            </div>
        </React.Fragment>
    );
}
export default withReducer('registerApp', reducer)(RegistrationTable);
