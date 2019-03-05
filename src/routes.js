import App from './pages/App'
import Login from './pages/Login'
import Sellproduct from './pages/Sellproduct'
import Specialtask from "./pages/Specialtask"
import Report from "./pages/Report"
import Clearbill from "./pages/Clearbill"
import Edit from "./pages/Edit"
import Rate from "./pages/Rating"

import Form_accounting from "./components/Report/Form_accounting"

const routes = [{
    path: '/',
    component: App,
    indexRoute: { component: Login },
    childRoutes: [
        { path: '/speceialtask', component: Specialtask },
        { path: '/sell_product', component: Sellproduct },
        { path: '/report/:checkReport', component: Report },
        { path: '/clearbill/:checkClearBill', component: Clearbill },
        { path: '/form_acc', component: Form_accounting },
        { path: '/edit/:checkEdit', component: Edit },
        { path: '/rate/:checkRate/:cusCode', component: Rate },
        // { path: '/form_acc', component: Form_accounting },
    ]
}]

export default routes