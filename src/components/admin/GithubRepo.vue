<template>
  <n-card title="GitHub Repo" style="margin-top: 2rem">
    <div class="github-links">
      <a
        href="https://github.com/lichenghsu/pet-shop-backend-rest-api"
        target="_blank"
        class="github-btn"
      >
        <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38
             0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
             -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
             -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.12 0 0
             .67-.21 2.2.82A7.68 7.68 0 018 4.69c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82
             2.2-.82.44 1.11.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65
             3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01
             8.01 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
        後端：pet-shop-backend-rest-api
      </a>

      <a
        href="https://github.com/lichenghsu/pet-shop-vue-frontend"
        target="_blank"
        class="github-btn"
      >
        <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38
             0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
             -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07
             -1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.12 0 0
             .67-.21 2.2.82A7.68 7.68 0 018 4.69c.68.003 1.36.092 2 .27 1.53-1.04 2.2-.82
             2.2-.82.44 1.11.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65
             3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01
             8.01 0 0016 8c0-4.42-3.58-8-8-8z"
          ></path>
        </svg>
        前端：pet-shop-vue-frontend
      </a>
    </div>
  </n-card>
</template>

<style scoped>
.github-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.github-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
  color: #24292f;
  background-color: #f6f8fa;
  padding: 8px 12px;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}
.github-btn:hover {
  background-color: #eaecef;
}
</style>
