import { db, pool } from './client.js'
import { dict, dictDetail } from './schema.js'

/** 初始化系统状态字典，重复执行时只补充缺失记录，保留已有数据。 */
try {
  await db.transaction(async (tx) => {
    await tx.insert(dict).values({
      name: '系统状态',
      dictType: 'sys_status',
    }).onConflictDoNothing({ target: dict.dictType })

    await tx.insert(dictDetail).values([
      {
        dictType: 'sys_status',
        label: '启用',
        value: '1',
        index: 0,
        tagType: 'primary',
      },
      {
        dictType: 'sys_status',
        label: '停用',
        value: '0',
        index: 1,
        tagType: 'danger',
      },
    ]).onConflictDoNothing({ target: [dictDetail.dictType, dictDetail.value] })
  })

  console.log('数据库初始字典数据写入完成')
} finally {
  await pool.end()
}
