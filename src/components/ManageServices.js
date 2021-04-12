import React from 'react'

import Switch from 'react-switch'

const ManageServices = () => {


	const [stateA, setStateA] = React.useState({checked:true})
	const [stateB, setStateB] = React.useState({checked:false})
	const [stateC, setStateC] = React.useState({checked:true})
	const [stateD, setStateD] = React.useState({checked:false})


	function handleChangeA(checked){
		setStateA({checked})
		console.log("handle.....", "$$$$");
	}

	function handleChangeB(checked){
		setStateB({checked})
		console.log("handle.....", "$$$$");
	}

	function handleChangeC(checked){
		setStateC({checked})
		console.log("handle.....", "$$$$");
	}

	function handleChangeD(checked){
		setStateD({checked})
		console.log("handle.....", "$$$$");
	}

	return <div id="app__content" className="content-padding">

		<h3 className="page__heading float-left">Manage Services</h3>

		<button className="btn btn-sm btn-black float-right">Add New Service</button>

		<table className="" width="100%">
			<tbody>
				<tr>
					<td>Request Item</td>
					<td><button className="btn btn-sm">Edit</button> <Switch onChange={handleChangeA} checked={stateA.checked} checkedIcon={false} uncheckedIcon={false} height={20} width={40} handleDiameter={12} className="app__switch"/> </td>
				</tr>
				<tr>
					<td>Turn Down Service</td>
					<td><button className="btn btn-sm">Edit</button> <Switch onChange={handleChangeB} checked={stateB.checked} checkedIcon={false} uncheckedIcon={false} height={20} width={40} handleDiameter={12} className="app__switch"/> </td>
				</tr>
				<tr>
					<td>Cleaning Request</td>
					<td><button className="btn btn-sm">Edit</button> <Switch onChange={handleChangeC} checked={stateC.checked} checkedIcon={false} uncheckedIcon={false} height={20} width={40} handleDiameter={12} className="app__switch"/> </td>
				</tr>
				<tr>
					<td>Laundry</td>
					<td><button className="btn btn-sm">Edit</button> <Switch onChange={handleChangeD} checked={stateD.checked} checkedIcon={false} uncheckedIcon={false} height={20} width={40} handleDiameter={12} className="app__switch"/> </td>
				</tr>
			</tbody>
		</table>


	</div>
}


export default ManageServices