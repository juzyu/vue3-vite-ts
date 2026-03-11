<template>
  <div class="download-demo">
    <h2>文件下载示例</h2>

    <div class="form-section">
      <el-input
        v-model="apiUrl"
        placeholder="请输入接口地址"
        style="width: 400px; margin-right: 10px"
      />

      <el-button type="primary" @click="downloadFile" :loading="downloading">
        {{ downloading ? '下载中...' : '下载文件' }}
      </el-button>
    </div>

    <div class="info-section" v-if="downloadInfo">
      <p>文件名: {{ downloadInfo.fileName }}</p>
      <p>文件大小: {{ downloadInfo.fileSize }}</p>
      <p>下载状态: {{ downloadInfo.status }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

// 接口地址
const apiUrl = ref('http://your-api-domain.com/api/download');

// 下载状态
const downloading = ref(false);

// 下载信息
const downloadInfo = ref<{
  fileName: string;
  fileSize: string;
  status: string;
} | null>(null);

/**
 * 下载文件的核心方法
 */
const downloadFile = async () => {
  try {
    downloading.value = true;
    downloadInfo.value = null;

    // 发送 POST 请求，关键配置：responseType 为 'blob'
    const response = await axios({
      method: 'post',
      url: apiUrl.value,
      data: {
        // 这里放你需要提交的数据
        param1: 'value1',
        param2: 'value2',
      },
      responseType: 'blob', // 重要：告诉 axios 响应数据是二进制流
      headers: {
        'Content-Type': 'application/json',
      },
      // 可选：监听下载进度
      onDownloadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`下载进度: ${percentCompleted}%`);
        }
      },
    });

    // 从响应头获取文件名（如果后端有设置）
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'document.doc'; // 默认文件名

    if (contentDisposition) {
      // 解析 Content-Disposition 头获取文件名
      const fileNameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (fileNameMatch && fileNameMatch[1]) {
        fileName = fileNameMatch[1].replace(/['"]/g, '');
        // 处理 URL 编码的文件名
        fileName = decodeURIComponent(fileName);
      }
    }

    // 创建 Blob 对象
    const blob = new Blob([response.data], {
      type: 'application/msword', // 或者使用 response.headers['content-type']
    });

    // 创建下载链接
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;

    // 触发下载
    document.body.appendChild(link);
    link.click();

    // 清理
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    // 更新下载信息
    downloadInfo.value = {
      fileName,
      fileSize: formatFileSize(blob.size),
      status: '下载成功',
    };

    console.log('文件下载成功');
  } catch (error: any) {
    console.error('下载失败:', error);
    downloadInfo.value = {
      fileName: '-',
      fileSize: '-',
      status: `下载失败: ${error.message}`,
    };
  } finally {
    downloading.value = false;
  }
};

/**
 * 格式化文件大小
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
</script>

<style scoped>
.download-demo {
  padding: 20px;
}

.form-section {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.info-section {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.info-section p {
  margin: 8px 0;
  color: #333;
}
</style>
