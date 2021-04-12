import React from 'react'

const Admin =  ()=>{
	return <div className="container-fluid">

		<div className="row">

			<div className="col-sm-12">

				<h1>Avendi Admin</h1>
				<form>
					<h4>Register a Hotel (Tenant)</h4>

					<div class="form-group">
						<label for="">Hotel Name</label>
						<input type="text" class="form-control form-control-sm" name="" />
					</div>
					
					<div class="form-group">
						<label for="">Email</label>
						<input type="text" class="form-control form-control-sm" name="" />
					</div>

					<div class="form-group">
						<label for="">Password</label>
						<input type="password" class="form-control form-control-sm" name="" />
					</div>

					<div class="form-group">
						<label for="">Confirm Password</label>
						<input type="password" class="form-control form-control-sm" name="" />
					</div>

					<button class="btn btn-danger">Register</button>

				</form>

			</div>

		</div>


	</div>
}


export default Admin