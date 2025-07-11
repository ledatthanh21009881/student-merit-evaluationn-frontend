import React from 'react';
import { Card, Form, Input, Row, Col, DatePicker, Typography, Avatar, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Title } = Typography;

const StudentProfile: React.FC = () => {
  return (
    <div style={{ padding: 24, background: '#f0f8ff', minHeight: '100vh' }}>
      <Card style={{ borderRadius: 10 }} bordered>
        <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
          <Title level={4} style={{ color: '#003366' }}>THÔNG TIN CHUNG</Title>
          <Button icon={<EditOutlined />} type="link">SỬA</Button>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} sm={6} style={{ textAlign: 'center' }}>
            <Avatar src="/avatar-default.png" size={120} />
            <br />
            <Button
              icon={<EditOutlined />}
              style={{ marginTop: 8 }}
              type="link"
            >
              Đổi ảnh
            </Button>
          </Col>

          <Col xs={24} sm={18}>
            <Form layout="vertical">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item label="Mã số sinh viên">
                    <Input disabled value="2021001234" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Ngày sinh">
                    <DatePicker format="DD/MM/YYYY" disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Mã lớp học">
                    <Input disabled value="DHKTPM17A" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Ngành học">
                    <Input disabled value="Kỹ thuật phần mềm" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Hệ đào tạo">
                    <Input disabled value="Chính quy" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Khoá học">
                    <Input disabled value="2021 - 2025" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Số điện thoại">
                    <Input disabled value="0123456789" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Email">
                    <Input disabled value="sinhvien@iuh.edu.vn" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Chức vụ">
                    <Input disabled value="Sinh viên" />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="Giới tính">
                    <Input disabled value="Nam" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Dân tộc">
                    <Input disabled value="Kinh" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Tôn giáo">
                    <Input disabled value="Không" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Số CCCD">
                    <Input disabled value="123456789012" />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item label="Ngày cấp">
                    <DatePicker disabled format="DD/MM/YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="Nơi cấp">
                    <Input disabled value="TP.HCM" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Địa chỉ thường trú">
                    <Input disabled value="123 đường ABC, Phường XYZ, TP.HCM" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="Ngày vào Đảng">
                    <DatePicker disabled format="DD/MM/YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Ngày vào Đoàn">
                    <DatePicker disabled format="DD/MM/YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Ngày vào Hội">
                    <DatePicker disabled format="DD/MM/YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default StudentProfile;
