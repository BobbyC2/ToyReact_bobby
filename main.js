// for ( let i of [1,2,3]){
//     console.log(i);
// }
// let a = <div></div>
import { createElement, Component, render } from './toy-react';

class MyComponent extends Component {
    render() {
        return <div>
            <h1>依赖真实节点Dom</h1>
            <h2> {this.children} </h2>
            <h2>2020/9/7/星期一/23:43</h2>
        </div>
    }
}


render(<MyComponent id="a" class="b">
    {/* style={{textAlign:"center"}} 无法解析 */}
    <div style={{ textAlign: "center" }}>bobby</div>
    <div></div>
</MyComponent>, document.body)