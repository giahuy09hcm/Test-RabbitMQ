const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://bobadfbe:mwAOAPi0JIr9RhMukVvJ5RBMY-OqcoTm@armadillo.rmq.cloudamqp.com/bobadfbe'
const amqp_url_docker = 'amqp://localhost:5672'
const receiveMail = async () => {
    try {
        const conn = await amqplib.connect(amqp_url_docker)
        const channel = await conn.createChannel()
        const nameExchange = 'sendMail'
        await channel.assertExchange(nameExchange,'topic',{
            durable: false //=true thi khi restart lai ko bi mat message (luu y khi set true thi set luon cho consumer)
        })
        const{
            queue
        }=await channel.assertQueue('',{
            exclusive: true //=true xoa hang doi sau khi stop consumer
        })
        const agrs = process.argv.slice(2)
        if(!agrs.length){
            process.exit(0)
        }
        // *voi moi tu bat ki        #voi 1 hoac nhieu tu khop
        console.log(`waiting queue::${queue}::::topic::${agrs}`)
        agrs.forEach(async key => {
            await channel.bindQueue(queue,nameExchange,key)
        })
        await channel.consume(queue,msg =>{
            console.log(`Routing key::::${msg.fields.routingKey}::::msg:: ${msg.content.toString()}`)
        })
    } catch (error) {
        console.error('Error::',error.message)
    }
}
receiveMail()