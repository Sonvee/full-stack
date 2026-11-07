# ADR-01：浏览器登录采用 Redis 服务端会话

## 状态

已接受。日期：2026-11-07。

## 关联文档

- 需求：[管理系统基础框架 PRD](../prd/01-admin-foundation.md)
- 相关项目实现：[后端应用注册](../../apps/backend/src/app.ts)

## 背景与约束

首版为单组织独立部署的 Vue 管理前端与 Fastify 后端，使用本地用户名和密码登录。用户、角色及权限会在系统内维护，管理员需要能够停用账号、重置密码并调整权限。用户确认关闭并重新打开浏览器后应继续保持登录。

后端目前已注册 `@fastify/redis`，并使用 Redis 配置，但还没有认证会话或业务数据表。Fastify 官方生态同时提供 `@fastify/session` 和 `@fastify/jwt` 等不同用途的插件；官方将 `@fastify/jwt` 描述为 JWT 工具，将 `@fastify/session` 描述为会话插件，并未规定 JWT 是唯一鉴权方案。

## 可行选项

1. **`@fastify/session` + Redis 服务端会话**：浏览器保存会话 Cookie 标识，会话状态保存在服务端存储。支持跨浏览器重启的持久 Cookie，并可由服务端撤销会话。
2. **`@fastify/secure-session` 加密 Cookie 会话**：把会话数据加密后放在 Cookie 中，不需要会话存储；集中撤销单个登录会话需要额外机制。
3. **JWT**：以签名令牌承载认证状态，适用于需要无状态令牌验证的场景；立即撤销令牌通常需要额外的服务端状态或较短令牌期限。

## 决策

首版采用 `@fastify/session` 的服务端会话，使用 Redis 作为会话存储，并通过设置有效期的持久 Cookie 支持浏览器重启后继续登录。该决定符合本系统的第一方浏览器登录、用户管理和权限变更需求。

会话过期遵循 PRD 的 FR-03 / D-17：闲置 7 天过期；有效使用可续延闲置期限，但单次登录最长 30 天。关闭浏览器不直接使会话失效。Cookie 和 Redis 存储的过期时间需与上述规则保持一致，不能因续期突破最长时限；具体续期触发规则在 Spec 中定义。

并发会话遵循 PRD 的 FR-02 / D-18：允许同一账号在多个设备或浏览器同时登录，各会话独立，新登录不替换已有会话；用户退出仅撤销当前会话。

管理变更遵循 PRD 的 FR-08 / D-20：停用账号或重置密码撤销该账号全部会话；用户角色分配或角色权限调整不强制下线，在下一次请求按新权限校验。

## 后果与约束

- 必须显式配置 Redis 会话存储；`@fastify/session` 的默认内存存储不用于生产环境。现有 `@fastify/redis` 连接不等同于会话存储适配器，Spec 需确认复用方式或适配器实现。
- 浏览器 Cookie 应设置 `HttpOnly`、生产环境 `Secure` 和适当的 `SameSite` 策略；基于 Cookie 的写操作需要定义 CSRF 防护。
- 登录成功后需轮换会话标识；用户退出仅撤销当前会话，账号停用和密码重置撤销该账号全部会话。鉴权时不得只信任会话中陈旧的角色权限快照。
- Redis 成为认证会话可用性的依赖；部署和健康检查需明确其影响。
- 会话审计细节仍待 PRD / Spec 确认。

## 参考

- [Fastify 官方插件生态](https://fastify.dev/docs/latest/Guides/Ecosystem/)
- [`@fastify/session` 官方仓库与 API](https://github.com/fastify/session)
- [`@fastify/secure-session` 官方仓库](https://github.com/fastify/fastify-secure-session)
- [`@fastify/jwt` 官方仓库](https://github.com/fastify/fastify-jwt)
