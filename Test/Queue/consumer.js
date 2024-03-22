const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://bobadfbe:mwAOAPi0JIr9RhMukVvJ5RBMY-OqcoTm@armadillo.rmq.cloudamqp.com/bobadfbe'
const amqp_url_docker = 'amqp://localhost:5672'
const receiveQueue = async () => {
    try {
        const conn = await amqplib.connect(amqp_url_docker)
        const channel = await conn.createChannel()
        const nameQueue = 'q2'
        await channel.assertQueue(nameQueue,{
            durable: true
        })
        await channel.consume(nameQueue,msg =>{
            console.log('Msg::::', msg.content.toString())
        },{
            noAck: true // =true thi se ngung gui message khi da xac nhan duoc co consumer nhan duoc message =false se gui den tat ca consumer
        })
    } catch (error) {
        console.error('Error::', error.message)
    }
}

receiveQueue()