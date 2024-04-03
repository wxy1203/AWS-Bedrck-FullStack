import { View, Card, Alert, Text, useTheme, Flex, Heading, Button } from "@aws-amplify/ui-react"
import { ConversationEvent } from "../../apis/agent-api/types"
import { TypingEffect } from "../typeEffect"
import { createBarChart } from './chart'
import React, { useRef, useEffect } from 'react';

interface ChatItemProps {
    text: string
    event: ConversationEvent
    lastEventTime: number,
}

export function UserChatMessage (props: ChatItemProps) {
    return <View textAlign='right' paddingLeft={20} paddingRight={20}>
        <Card lineHeight={2}>
            <Text>
                {/* 用户消息 */}
                {props.text}
            </Text>
        </Card>
    </View>
}

export function UserChatError (props: ChatItemProps) {
    return <View paddingLeft={20} paddingRight={20}>
        <Card lineHeight={2}>
            <Alert variation="error" fontSize='smaller'>
                {props.text}
            </Alert>
        </Card>
    </View>
}

export function AgentChatMessage (props: ChatItemProps) {
    return <View textAlign='left' paddingLeft={20} paddingRight={20}>
        <View lineHeight={2}>
            {/* 我是agent chat */}
            <Text>
                {
                    props.event.disableTyping && props.text
                }
                {
                    !props.event.disableTyping && <TypingEffect startTime={props.lastEventTime} text={props.text}/>
                }
            </Text>  
        </View>
    </View>
}

export function AgentPartialChatMessage (props: {text: string}) {
    return <View textAlign='left' paddingLeft={20} paddingRight={20}>
        {/* 我是agent partial chat */}
        <View lineHeight={2}>
            <Text>
                {props.text}
                
            </Text>
        </View>
    </View>
}

export function AgentInnerDialogBlock (props: ChatItemProps) {
    const theme = useTheme()

    return <View textAlign='left' paddingLeft={20} paddingRight={20}>
        <View lineHeight={2} padding={theme.tokens.space.medium}> 
        {/* 我是agent inner dialog */}
            <Text>
                . . .
                <TypingEffect startTime={props.lastEventTime} text={props.text}/>       
            </Text> 
        </View>
    </View>
}

export function AgentWarningBlock (props: ChatItemProps) {
    return <View textAlign='left' paddingLeft={20} paddingRight={20}>
        <View lineHeight={2}>   
        {/* 我是agent warning    */}
            <Alert variation='warning' fontSize='smaller'>
                <TypingEffect startTime={props.lastEventTime} text={props.text}/>
            </Alert>
        </View>
    </View>
}

function tryFixJsonString (render: string){

    // Some general parsing as the agent often gives results in wildly different formats
    if (render.startsWith('"') && render.endsWith('"')) {
        render = render.substring(1, render.length - 1).replaceAll('\\n', '\n')
    }
    if (render.startsWith('json')) {
        render = render.substring(4)
    }
    try {
        render = JSON.stringify(JSON.parse(render), null, 2)
    }
    catch (e) {
        try {
            render = JSON.stringify(JSON.parse(render.replaceAll('\'', '"')), null, 2)
        }
        catch (e) {}
    }

    return render;
}


// Graph QL Query
export function AgentGraphQLBlock (props: {invoke: () => void} & ChatItemProps) {
    
    return <View textAlign='left' paddingLeft={20} paddingRight={20}>
    下面是Query
        <View lineHeight={2}>
            <Card paddingLeft={10} className="codeBoxHeader">
                <Flex direction='row' justifyContent='space-between'>

                    <Heading>
                        GraphQL Query
                    </Heading>
                    {/* 下面是invoke button */}
                    <Heading>
                        <Button className="invokeButton" onClick={props.invoke}>
                            Click To Invoke
                        </Button>
                    </Heading>
                </Flex>
            </Card>
            <pre>
                <code>
                    <Text>
                        {props.text}
                    </Text>
                </code>
            </pre>
        </View>
    </View>
}


// Graph Query结果
export function GraphQLResultBlock (props: ChatItemProps) {    
    return <View textAlign='left' paddingLeft={20} paddingRight={20}> 
    {/* 下面是query result */}
        <View lineHeight={2}>
            <Card paddingLeft={10} className="codeBoxHeader">
                <Heading>
                    Query Result
                </Heading>
                {/* 下面是draw button */}
                {/* <Heading>
                    <Button className="invokeButton">
                        Click To Draw Chart
                    </Button>
                </Heading> */}
            </Card>
            <pre >
                <code>
                    <Text>
                        {tryFixJsonString(props.text)}
                    </Text>
                </code>
            </pre>
        </View>
    </View>
}

// 用Json画图
function JsonDraw() {
    
    const canvasRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
        createBarChart(canvasRef.current);
        // Save the chart instance if you need to use it later
        }
    }, []);

    return <canvas ref={canvasRef} />;
}

// 代码 和 代码执行结果
export function AgentJSONBlock (props: ChatItemProps) {
    return (
        <View textAlign='left' paddingLeft={20} paddingRight={20}>
            
            <View lineHeight={2}>
                <Card paddingLeft={10} className="codeBoxHeader">
                    <Heading>
                        Code
                    </Heading>
                    {/* 下面是draw button */}
                    <Heading>
                        <Button className="invokeButton">
                            Click To Draw Chart
                        </Button>
                    </Heading>
                </Card>
                
                {/* 下面是代码 */}
                <pre><code>
                    {props.text}
                </code></pre>
            </View>

        </View>
    );
}

export function DrawGraphBlock (props: ChatItemProps) {
    return (
        <View textAlign='left' paddingLeft={20} paddingRight={20}>
            <View lineHeight={2}>
                <Card paddingLeft={10} className="codeBoxHeader">
                    <Heading>
                        Graph
                    </Heading>
                
                {/* 下面是用代码画的图 */}
                <JsonDraw />
                </Card>
            </View>
        </View>
    );
}