import { View, Card, Alert, Text, useTheme, Flex, Heading, Button } from "@aws-amplify/ui-react"
import { ConversationEvent } from "../../apis/agent-api/types"
import { TypingEffect } from "../typeEffect"

interface ChatItemProps {
    text: string
    event: ConversationEvent
    lastEventTime: number,
}

export function UserChatMessage (props: ChatItemProps) {
    return <View textAlign='right' paddingLeft={20} paddingRight={20}>
        <Card lineHeight={2}>
            <Text>
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
        <View lineHeight={2}>
            <Text>
                {props.text}
                
            </Text>
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

export function AgentJSONBlock (props: ChatItemProps) {

    // Function to safely parse JSON
    // const tryParseJsonString = (text: string) => {
    //     try {
    //         return JSON.parse(text);
    //     } catch (error) {
    //         console.error('Invalid JSON:', error);
    //         return null;
    //     }
    // };

    // // Execute the code and display the result
    // const executeCode = (code: string) => {
    //     try {
    //         return eval(code);
    //     } catch (error) {
    //         console.error('Error executing code:', error);
    //         return null;
    //     }
    // };

  
    return (
        <View textAlign='left' paddingLeft={20} paddingRight={20}>
            <View lineHeight={2}>
                <Text>
                    下面是代码
                </Text>
                <pre><code>
                    {props.text}
                </code></pre>
            </View>
            <View>
                <Text>
                    下面是代码执行结果
                </Text>
                {/* Assuming props.text contains the code */}
                {/* {executeCode(props.text)} */}
                {props.text}
            </View>
        </View>
    );

    // // Then render it
    // return <View textAlign='left' paddingLeft={20} paddingRight={20}>
    //     <View lineHeight={2}>
    //         <Text>
    //             {/* here is the code display */}
    //             下面是代码
    //             <pre><code>
    //                 {tryFixJsonString(props.text)}
    //             </code></pre>
    //         </Text>
    //     </View>
    // </View>
}

export function AgentGraphQLBlock (props: {invoke: () => void} & ChatItemProps) {
    
    return <View textAlign='left' paddingLeft={20} paddingRight={20}>
    下面是Query
        <View lineHeight={2}>
            <Card paddingLeft={10} className="codeBoxHeader">
                <Flex direction='row' justifyContent='space-between'>

                    <Heading>
                        GraphQL Query
                    </Heading>
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

export function GraphQLResultBlock (props: ChatItemProps) {    
    return <View textAlign='left' paddingLeft={20} paddingRight={20}> 
    下面是query result
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

export function AgentInnerDialogBlock (props: ChatItemProps) {
    const theme = useTheme()

    return <View textAlign='left' paddingLeft={20} paddingRight={20}>
        <View lineHeight={2} padding={theme.tokens.space.medium}> 
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
            <Alert variation='warning' fontSize='smaller'>
                <TypingEffect startTime={props.lastEventTime} text={props.text}/>
            </Alert>
        </View>
    </View>
}




