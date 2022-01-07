/**
 * 路由跳转
 * @param name
 * @param params
 */
export function goRoute(name,params){
    console.log('跳转到菜单添加页面')
    this.$router.push({ name: name,params:params})
}

