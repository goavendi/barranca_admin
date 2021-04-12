import React from 'react'

import MenuForm from './MenuForm'

import './FoodMenu.css'

const Edit = () => {
	return <div id="app__content" className="padding">
		<h3>Edit Menu Item</h3>
		<MenuForm mode="EDIT" />
	</div>
}


export default Edit