const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://bobadfbe:mwAOAPi0JIr9RhMukVvJ5RBMY-OqcoTm@armadillo.rmq.cloudamqp.com/bobadfbe'
const amqp_url_docker = 'amqp://localhost:5672'
const sendMail = async () => {
    try {
        const conn = await amqplib.connect(amqp_url_docker)
        const channel = await conn.createChannel()
        const nameExchange = 'sendMail'
        await channel.assertExchange(nameExchange,'topic',{
            durable: false //=true thi khi restart lai ko bi mat message (luu y khi set true thi set luon cho consumer)
        })
        const agrs = process.argv.slice(2)
        const msg = agrs[1] || 'Fixed!'
        const topic = agrs[0]
        console.log(`msg::${msg}::::topic::${topic}`)
        await channel.publish(nameExchange,topic,Buffer.from(msg))
        console.log(`[x] SEND OK:::: ${msg}`)
    } catch (error) {
        console.error('Error::',error.message)
    }
}
sendMail()