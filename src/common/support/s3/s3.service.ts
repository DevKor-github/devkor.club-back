import { Injectable, NotAcceptableException } from "@nestjs/common";
import * as AWS from "aws-sdk";

@Injectable()
export class S3Service {
  /*
  async upload(file: Express.Multer.File) {
    const fileExtension = file.originalname.split(".").pop();
    if (fileExtension.toLowerCase() !== "pdf")
      throw new NotAcceptableException("must be pdf");
    const albumBucketName = process.env.AWS_BUCKET_NAME; // S3의 버킷 이름
    const region = process.env.AWS_REGION; // 서울
    const accessKeyId = process.env.AWS_ACCESS_KEY; // IAM에서 생성한 사용자의 accessKeyId
    const secretAccessKey = process.env.AWS_SECRET_KEY; // IAM에서 생성한 사용자의 secretAccessKey
    AWS.config.update({
      region,
      accessKeyId,
      secretAccessKey,
    });

    const fileContent = file.buffer;
    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: `${Date.now()}.${fileExtension}`,
        Body: fileContent,
        ContentType: file.mimetype,
        ContentEncoding: file.encoding,
      },
    });

    const data = await upload.promise();
    return data.Location;
  }
    */
  async createFileUploadPresignedUrl(fileName: string): Promise<string> {
    const extension = fileName.split(".").pop();
    if (extension.toLowerCase() !== "pdf")
      throw new NotAcceptableException("must be pdf");

    const albumBucketName = process.env.AWS_BUCKET_NAME; // S3의 버킷 이름
    const region = process.env.AWS_REGION; // 서울
    const accessKeyId = process.env.AWS_ACCESS_KEY; // IAM에서 생성한 사용자의 accessKeyId
    const secretAccessKey = process.env.AWS_SECRET_KEY; // IAM에서 생성한 사용자의 secretAccessKey
    AWS.config.update({
      region,
      accessKeyId,
      secretAccessKey,
    });
    const s3 = new AWS.S3();
    const params = {
      Bucket: albumBucketName,
      Key: fileName,
      Expires: 60,
    };
    const url = await s3.getSignedUrlPromise("putObject", params);
    return url;
  }
}
