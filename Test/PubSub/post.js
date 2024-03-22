const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://bobadfbe:mwAOAPi0JIr9RhMukVvJ5RBMY-OqcoTm@armadillo.rmq.cloudamqp.com/bobadfbe'
const amqp_url_docker = 'amqp://localhost:5672'
const postVideo = async ({msg}) => {
    try {
        const conn = await amqplib.connect(amqp_url_docker)
        const channel = await conn.createChannel()
        const nameExchange = 'video'
        await channel.assertExchange(nameExchange,'fanout',{
            durable: false //=true thi khi restart lai ko bi mat message (luu y khi set true thi set luon cho consumer)
        })
        await channel.publish(nameExchange,'',Buffer.from(msg))
        console.log(`[x] SEND OK:::: ${msg}`)
        setTimeout(function(){
            conn.close
            process.exit(0)
        },2000)
    } catch (error) {
        console.error('Error::',error.message)
    }
}
const msg = process.argv.slice(2).join(' ') || 'Hello Exchange'
postVideo({msg})