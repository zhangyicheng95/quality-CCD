/**
 *@模块名称：withDefaultProps
 *
 *@创建人：ligaoming
 *
 *@作用：高级组件 解决默认参数问题
 *
 *@date 2020/6/9
 *
 *@版权所有：
 */
export const withDefaultProps = <P extends object, DP extends Partial<P> = Partial<P>>(
    defaultProps: DP,
    Cmp: React.ComponentType<P>
) => {
    type RequiredProps = Omit<P, keyof DP>
    type Props = Partial<DP> & RequiredProps
    Cmp.defaultProps = defaultProps;
    return (Cmp as React.ComponentType<any>) as React.ComponentType<Props>
}