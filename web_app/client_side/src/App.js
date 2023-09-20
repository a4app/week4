import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import EditForm from "./pages/EditForm";
import AddForm from "./pages/AddForm";
import Test from "./pages/Test";

const App = () => {

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/edit/:id/:u/:n/:e/:p/:a" element={<EditForm />} />
				<Route path="/add" element={<AddForm />} />
				<Route path="/" element={<Home />} />

				<Route path="/test" element={<Test />} />
				
			</Routes>
		</BrowserRouter>
	);
}

export default App;
