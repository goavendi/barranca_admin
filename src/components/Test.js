import React from 'react'



const Test =  ()=>{



	

	const tryNotification = async ()=>{

		

		// const swRegistration = await registerServiceWorker();
		// swRegistration.showNotification("title", {})
    // const permission =  await requestNotificationPermission();
    // showLocalNotification('This is title', 'this is the message', swRegistration);

	}

	return <div className="">
		<div className="app__notification">
			<button onClick={(e)=>tryNotification(e)}>notify</button>
		</div>
	</div>
}


export default Test