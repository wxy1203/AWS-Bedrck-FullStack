import { View, Card, Alert, Text, useTheme, Flex, Heading, Button } from "@aws-amplify/ui-react"
import { ConversationEvent } from "../../apis/agent-api/types"
import { TypingEffect } from "../typeEffect"
import { createBarChart } from './chart'
import React, { useState, useRef, useEffect } from 'react';
import Chart, { ChartConfiguration } from 'chart.js/auto'; // Import Chart.js library

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
                {/* 用户错误消息 */}
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
        {/* 我是agent warning */}
            <Alert variation='warning' fontSize='smaller'>
                <TypingEffect startTime={props.lastEventTime} text={props.text}/>
            </Alert>
        </View>
    </View>
}

// take string render, parse and reformat it into JSON string
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
    {/* 下面是Query */}
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

            <View>
                {/* <Card paddingLeft={10} className="codeBoxHeader">
                    <Heading>
                        Graph
                    </Heading>
                </Card> */}
                {/* 下面是用代码画的图 */}
                
                {/* 用Json画图 */}
                {/* <JsonDraw /> */}

                {/* 用HTML画图 */}
                {/* <div style={{ position: 'relative', height: 0, paddingBottom: '56.25%' }}>
                    <iframe src="/bar_chart.html" title="Result" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                </div>      */}
            </View>

        </View>
    );
}

export function DrawGraphBlock (props: ChatItemProps) {



    const firstWord = props.text.split('\n')[0];

    return (
        <View textAlign='left' paddingLeft={20} paddingRight={20}>
            <View lineHeight={2}>

                {firstWord.toLowerCase() === 'js' && (
                <Card paddingLeft={10} className="codeBoxHeader">
                    <Heading>
                    Graph
                    </Heading>
                </Card>
                )}

                {firstWord.toLowerCase() === 'js' ? (
                <JsonDraw part={props.text} />
                ) : (
                <Text>No Graph, can only draw graph for js new Chart code provided</Text>
                )}
                
            </View>
        </View>
    );
}

function JsonDraw({ part }: { part: string })  {
    
    const canvasRef = useRef(null);
    const [chartInstance, setChartInstance] = useState<Chart | null>(null);
    const chartCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (chartInstance) {
            // Destroy previous chart instance if exists
            chartInstance.destroy();
          }
        if (canvasRef.current) {
            // console.log(part)
            const firstWord = part.split("\n")[0];
            // console.log(firstWord)
            if (firstWord === "js") {
                // console.log("有new chart")
                const chartConfig = part.match(/\{.*\}/s);

                const chart: ChartConfiguration = eval(`(${chartConfig})`);
                // Generate new chart using parsed chart configuration
                const newChartInstance = new Chart(canvasRef.current, chart);

                setChartInstance(newChartInstance);
            }


            
        }
    }, []);

    return <canvas ref={canvasRef} />;
}