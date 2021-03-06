import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Layout } from 'antd';
import 'antd/dist/antd.css'

import Header from './ui/layout/Header'
import Sidebar from './ui/layout/Sidebar'
import FooterMobile from './ui/layout/FooterMobile'
import Hero from './ui/pages/Hero'
import Acquire from './ui/pages/Acquire'
// import Claim from './ui/pages/Claim'
import Stake from './ui/pages/Stake'
import Trade from './ui/pages/Trade'
import Stats from './ui/pages/Stats'
import Whitepaper from './ui/pages/Whitepaper'
import { Colour } from './ui/components'

import { ContextProvider } from './context'

import Breakpoint, { BreakpointProvider } from 'react-socks';

const { Content } = Layout;

const App = () => {

	return (
		<Router>
			<div>
				<ContextProvider>
					<BreakpointProvider>
						<Layout style={{ height: "100vh" }}>
							<Sidebar />
							<Header />
							<Content style={{ background: Colour().dgrey, color: Colour().white, paddingLeft: 30, paddingTop: 50, paddingRight:30, paddingBottom:20 }}>
								<Switch>
									<Route path="/" exact component={Hero} />
									<Route path="/overview" exact component={Hero} />
									<Route path="/acquire" exact component={Acquire} />
									<Route path="/claim" exact component={Acquire} />
									<Route path="/stake" exact component={Stake} />
									<Route path="/trade" exact component={Trade} />
									<Route path="/stats" exact component={Stats} />
									<Route path="/whitepaper" exact component={Whitepaper} />
								</Switch>
								<Breakpoint small down>
									<FooterMobile />
								</Breakpoint>
							</Content>
							{/* <Breakpoint small down>
									<FooterMobile />
								</Breakpoint> */}
						</Layout>
					</BreakpointProvider>
				</ContextProvider>
			</div>
		</Router>
	);
}

export default App;