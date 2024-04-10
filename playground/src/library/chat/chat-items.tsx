import { View, Card, Alert, Text, useTheme, Flex, Heading, Button } from "@aws-amplify/ui-react"
import { ConversationEvent } from "../../apis/agent-api/types"
import { TypingEffect } from "../typeEffect"
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
                {/* User Chat Message */}
                {props.text}
            </Text>
        </Card>
    </View>
}

export function UserChatError (props: ChatItemProps) {
    return <View paddingLeft={20} paddingRight={20}>
        <Card lineHeight={2}>
            <Alert variation="error" fontSize='smaller'>
                {/* User Chat Error */}
                {props.text}
            </Alert>
        </Card>
    </View>
}

export function AgentChatMessage (props: ChatItemProps) {
    return <View textAlign='left' paddingLeft={20} paddingRight={20}>
        <View lineHeight={2}>
            {/* Agent Chat Message */}
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
        {/* Agent Partial Chat Message */}
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
        {/* Agent Inner Dialog */}
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
        {/* Agent Warning */}
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


// GraphQL Query
export function AgentGraphQLBlock (props: {invoke: () => void} & ChatItemProps) {
    
    return <View textAlign='left' paddingLeft={20} paddingRight={20}>
    {/* GraphQL */}
        <View lineHeight={2}>
            <Card paddingLeft={10} className="codeBoxHeader">
                <Flex direction='row' justifyContent='space-between'>

                    <Heading>
                        GraphQL Query
                    </Heading>
                    {/* Query result invoke button */}
                    {/* <Heading>
                        <Button className="invokeButton" onClick={props.invoke}>
                            Click To Invoke
                        </Button>
                    </Heading> */}
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


// Graph Query Result
export function GraphQLResultBlock (props: ChatItemProps) {    
    return <View textAlign='left' paddingLeft={20} paddingRight={20}> 
    {/* query result */}
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


// Code Block
export function AgentJSONBlock (props: ChatItemProps) {
    return (
        <View textAlign='left' paddingLeft={20} paddingRight={20}>
            
            <View lineHeight={2}>
                <Card paddingLeft={10} className="codeBoxHeader">
                    <Heading>
                        Code
                    </Heading>
                    {/* Drawing Button */}
                    {/* <Heading>
                        <Button className="invokeButton">
                            Click To Draw Chart
                        </Button>
                    </Heading> */}
                </Card>
                
                {/* Code Itself */}
                <pre><code>
                    {props.text}
                </code></pre>
            </View>

            <View>
    
                {/* JSON Drawing */}
                {/* <JsonDraw /> */}

                {/* HTML Drawing */}
                {/* <div style={{ position: 'relative', height: 0, paddingBottom: '56.25%' }}>
                    <iframe src="/bar_chart.html" title="Result" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
                </div>      */}

            </View>

        </View>
    );
}

// Graph Drawing Block
export function DrawGraphBlock (props: ChatItemProps) {

    const firstWord = props.text.split('\n')[0];

    return (
        <View textAlign='left' paddingLeft={20} paddingRight={20}>
            <View lineHeight={2}>

                {firstWord.toLowerCase() === 'js' && (
                    <Heading>
                    Graph
                    </Heading>
                )}

                {firstWord.toLowerCase() === 'js' ? (
                <JsonDraw part={props.text} />
                ) : (
                    <Heading>
                    No Graph Generated
                    </Heading>
                )}
                
            </View>
        </View>
    );
}

// Use JSON data to draw chart
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

            const firstWord = part.split("\n")[0];

            if (firstWord === "js") {

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