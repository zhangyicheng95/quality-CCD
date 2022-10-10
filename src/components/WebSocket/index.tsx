/**
 *@模块名称：WebSocket
 *
 *@创建人：ligaoming
 *
 *@作用：消息推送
 *
 *@date 2020/11/3
 *
 *@版权所有：
 */
import React, {useEffect} from 'react';
import io from 'socket.io-client';
import {getToken} from '@httpClient/Global';
import {post} from "@/httpClient";

const WebSocket = (props: any) => {
	const {url, onEvent} = props;
	useEffect(() => {
		let socket: any;
		if (url) {
			socket = io(url, {
				// 实际使用中可以在这里传递参数
				query: {
					'Authorization': `${getToken()}`, // Bearer
				},
				transports: ['websocket']
			});
			socket.on('connect', (data: any) => {
				console.log(`连接成功!`);
				setTimeout(() => {
					post(`/receive/event`);
				})
			});
			socket.on('event', (data: any) => {
				onEvent(data)
			});
			socket.on('disconnect', (data: any) => {
				console.log(`异常，断开`)
			});
		}
		return () => {
			if (socket) {
				socket.close();
			}
		}
	}, [url]);
	
	return (
		<React.Fragment></React.Fragment>
	)
};

export default WebSocket;
