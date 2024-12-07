import axios from 'axios'
import dayjs from 'dayjs'
import { AppContext } from './database/index.js'

export class TaskMethod {

    static execute = async (task) => {

        const db = new AppContext()

        let taskHistory

        await db.transaction(async (transaction) => {
            try {

                taskHistory = await db.TaskHistory.create({entryAt: dayjs().format('YYYY-MM-DD HH:mm:ss'), taskId: task.id, finishedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')}, {transaction})

                console.log(`${dayjs().format('DD/MM/YYYY HH:mm:ss')} Task: executing - id: ${task.id} methodId: ${task.methodId} schedule: ${task.schedule} arguments: ${JSON.stringify(task.arguments)}`)

                switch (task.methodId) {
                    case 'e02e5da6-52e8-4ce8-8b06-9aa54b919d52':
                        await this.jobs('http://localhost:9001/jobs/integration/ssw/import')
                        break
                }

                await db.TaskHistory.update({taskId: task.id, finishedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')}, {where: [{id: taskHistory.id}], transaction})

            } catch (error) {
                await db.TaskHistory.update({taskId: task.id, finishedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'), error: error.message}, {where: [{id: taskHistory.id}], transaction})
            }
        })

    }

    static jobs = async (url) => {

        const result = await axios.post(url)

        if (result.status == 201) {
            throw new Error(result.data)
        }
            
    }

}