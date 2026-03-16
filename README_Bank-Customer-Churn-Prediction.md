# Bank Customer Churn Prediction

## Mô tả dự án

Dự án nhằm phân tích và dự đoán khách hàng có khả năng rời bỏ (churn) tại một ngân hàng, từ đó hỗ trợ đội ngũ kinh doanh triển khai các chiến lược giữ chân khách hàng hiệu quả hơn. Mô hình sử dụng nhiều thuật toán machine learning, bao gồm cả mô hình tổ hợp (VotingClassifier).

## Dữ liệu

- **Nguồn dữ liệu**: file `Churn_Modelling.csv`.
- **Số lượng khách hàng**: 10.000 bản ghi với các thuộc tính:
  - **RowNumber**: Số thứ tự hàng
  - **CustomerId**: ID khách hàng
  - **Surname**: Họ khách hàng
  - **CreditScore**: Điểm tín dụng
  - **Geography**: Quốc gia (France, Spain, Germany)
  - **Gender**: Giới tính (Male/Female)
  - **Age**: Tuổi
  - **Tenure**: Số năm là khách hàng
  - **Balance**: Số dư tài khoản
  - **NumOfProducts**: Số sản phẩm sử dụng
  - **HasCrCard**: Có thẻ tín dụng hay không (1: Có, 0: Không)
  - **IsActiveMember**: Là thành viên hoạt động (1: Có, 0: Không)
  - **EstimatedSalary**: Lương ước tính
  - **Exited**: Nhãn mục tiêu (1: Churn, 0: Không churn)

## Cấu trúc dự án

- `Churn_Modelling.csv`: File dữ liệu gốc.
- `customer_churn.ipynb`: Notebook chứa toàn bộ quy trình phân tích, tiền xử lý, xây dựng và đánh giá mô hình.
- `README.md`: Tài liệu mô tả dự án (file hiện tại).

## Quy trình thực hiện trong `customer_churn.ipynb`

1. **Khám phá và tiền xử lý dữ liệu**
   - Đọc dữ liệu từ `Churn_Modelling.csv`, kiểm tra thiếu dữ liệu, phân phối các biến, tương quan.
   - Mã hóa biến phân loại `Geography`, `Gender` bằng **One-Hot Encoding** và ghép lại với bộ dữ liệu gốc.
   - Chọn các biến đầu vào: `CreditScore`, `Age`, `Tenure`, `Balance`, `NumOfProducts`, `HasCrCard`, `IsActiveMember`, `EstimatedSalary`, `Geography_Germany`, `Geography_Spain`, `Gender_Male`.
   - Chia dữ liệu train/test với `train_test_split` (test size 20%, `stratify=y`, `random_state=0`).
   - Cân bằng dữ liệu bằng **SMOTE** trên tập train để xử lý mất cân bằng nhãn `Exited`.

2. **Huấn luyện các mô hình đơn lẻ**
   - **Decision Tree**: `DecisionTreeClassifier` với tham số tối ưu (ví dụ: `ccp_alpha=0.0009494854875442462`) và phân tích thêm đường cong cắt tỉa (alpha) với các metric F1, Recall, Precision.
   - **Random Forest**: `RandomForestClassifier` với cấu hình tối ưu (ví dụ: `max_depth=11`, `n_estimators=51`, `min_samples_split=4`, `min_samples_leaf=1`), kèm biểu đồ **feature importance** để xem yếu tố nào ảnh hưởng nhiều tới churn.
   - **XGBoost**: `XGBClassifier` với các tham số như `min_child_weight=0.8`, `reg_alpha=0.4`, `reg_lambda=1.1` để cải thiện hiệu năng trên lớp thiểu số.

3. **Mô hình tổ hợp – Voting Classifier**
   - Xây dựng **VotingClassifier** (hard voting) kết hợp 3 mô hình: Decision Tree, Random Forest, XGBoost.
   - Định nghĩa hàm `evaluate_model` để:
     - Fit từng mô hình,
     - Dự đoán trên train/test,
     - Tính các chỉ số: Train Score, Test Score, F1, Recall, Precision.
   - Tổng hợp kết quả vào `results_df` để so sánh hiệu năng giữa các mô hình.

## Kết quả

### So sánh các mô hình

| Model              | Train Score | Test Score | F1 Score | Recall  | Precision |
|--------------------|------------:|-----------:|---------:|--------:|----------:|
| Decision Tree      | 0.8171      | 0.8185     | 0.5734   | 0.5995  | 0.5496    |
| Random Forest      | 0.9041      | 0.8080     | 0.5724   | 0.6315  | 0.5234    |
| XGBoost            | 0.9520      | 0.8130     | 0.5769   | 0.6265  | 0.5346    |
| Voting Classifier  | 0.9078      | 0.8195     | 0.5836   | 0.6216  | 0.5500    |

**Nhận xét**: VotingClassifier cho Test Score và F1 Score cao nhất, đồng thời giữ được Train Score vừa phải (ít overfit hơn so với XGBoost đơn lẻ).

### Đánh giá chi tiết trên tập test

Các classification report cho các mô hình tốt nhất (như Voting/RandomForest/XGBoost tinh chỉnh) cho kết quả xấp xỉ:

- **Lớp 0 (không churn)**: Precision ~0.90, Recall ~0.85–0.87, F1 ~0.88.
- **Lớp 1 (churn)**: Precision ~0.52–0.55, Recall ~0.60–0.63, F1 ~0.57–0.58.
- **Độ chính xác tổng thể (accuracy)**: ~0.81–0.82 trên 2000 khách hàng test.
- **Macro avg**: F1 ~0.72–0.73; **weighted avg**: F1 ~0.81–0.82.

Điều này cho thấy mô hình:

- Giữ được **độ chính xác tổng thể cao (~81–82%)**.
- Cải thiện **khả năng nhận diện khách hàng churn (Recall lớp 1 ~0.60–0.63)**.
- Cân bằng tương đối tốt giữa Precision–Recall thông qua việc thử nghiệm nhiều mô hình và Voting.

## Cách chạy

1. Cài đặt các thư viện cần thiết (gợi ý):

   ```bash
   pip install pandas numpy matplotlib seaborn scikit-learn imbalanced-learn xgboost
   ```

2. Mở file `customer_churn.ipynb` trong Jupyter Notebook hoặc VS Code.
3. Chạy các cell theo thứ tự để thực hiện phân tích dữ liệu, huấn luyện và đánh giá mô hình.

## Tóm tắt

Pipeline của dự án gồm: phân tích & xử lý dữ liệu, mã hóa biến phân loại, cân bằng dữ liệu bằng SMOTE, huấn luyện nhiều mô hình (Decision Tree, Random Forest, XGBoost), kết hợp bằng VotingClassifier, và đánh giá chi tiết bằng các chỉ số accuracy, F1, recall, precision. Kết quả cho thấy VotingClassifier cho hiệu năng tổng thể tốt nhất, phù hợp để hỗ trợ ngân hàng nhận diện sớm khách hàng có nguy cơ rời bỏ.



