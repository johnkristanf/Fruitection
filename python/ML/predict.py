import os
import numpy as np
import tensorflow as tf
from PIL import Image
from dotenv import load_dotenv
from keras._tf_keras.keras.applications.resnet import preprocess_input
from database.predict_db_operations import PredictDatabaseOperations

load_dotenv(os.path.join(os.path.dirname(__file__), '../.env'))


predict = PredictDatabaseOperations()

class ClamPrediction():

    def load_tflite_model(self, model_path):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file does not exist: {model_path}")
        
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        print("Model loaded successfully.")

        return interpreter

    def load_dataset_classes(self):
        CLASSES = predict.load_dataset_class_names()
        print("CLASSES IN PREDICT: ", CLASSES)
        return CLASSES

    def resize_and_preprocess_image(self, image_path, img_size, dtype):
        img = Image.open(image_path)
        img = img.resize(img_size) 
        img = np.array(img, dtype=dtype)
        return np.expand_dims(img, axis=0)

    def durian_predict(self, diseaseType, image_path):
        print("PREDICT")
        print("diseaseType: ", diseaseType)

        model_path = None
        ORIGINAL_CLASSES = None
        dtype = None
        img_size = None

        diseaseTypeLower = diseaseType.lower()

        if diseaseTypeLower == 'fruit':
            img_size = (180, 180)
            dtype = np.float32
            ORIGINAL_CLASSES = ['Durian blight', 'Durian spot', 'Unknown']
            model_path = os.path.abspath("./models/main/diseased_fruit.tflite")

        elif diseaseTypeLower == 'leaf':
            img_size = (180, 180)
            dtype = np.float32
            ORIGINAL_CLASSES = ['Leaf blight', 'Leaf spot', 'Unknown']
            model_path = os.path.abspath("./models/main/diseased_leaf.tflite")

        elif diseaseTypeLower == 'healthy':
            img_size = (180, 180)
            dtype = np.float32
            ORIGINAL_CLASSES = ['Mature', 'Unknown', 'Unripe']
            model_path = os.path.abspath("./models/main/healthy.tflite")

        else:
            img_size = (180, 180)
            dtype = np.float32
            ORIGINAL_CLASSES = ['Durian blight', 'Durian spot', 'Leaf blight', 'Leaf spot', 'Mature', 'Unknown', 'Unripe']
            model_path = os.path.abspath("./models/main/upload.tflite")


        print("model_path: ", model_path)
        print("dtype: ", dtype)
        print("ORIGINAL_CLASSES: ", ORIGINAL_CLASSES)

        model = self.load_tflite_model(model_path)
        preprocessed_image = self.resize_and_preprocess_image(image_path, img_size, dtype)

        input_details = model.get_input_details()
        output_details = model.get_output_details()

        input_index = input_details[0]['index']
        output_index = output_details[0]['index']

        model.set_tensor(input_index, preprocessed_image)

        model.invoke()

        predictions = model.get_tensor(output_index)
        print("Predictions:", predictions)

        # CLASSES = self.load_dataset_classes()

        print("Classes:", ORIGINAL_CLASSES)

        predictions_flat = predictions.flatten() 
        predictions_percentage = predictions_flat * 100  
        print("Predictions in percentage:", predictions_percentage)

        # PREDICTED CLASS
        predicted_class_index = np.argmax(predictions_flat) 
        predicted_class = ORIGINAL_CLASSES[predicted_class_index] 

        # PREDICTED PERCENTAGE
        predicted_class_percentage = predictions_percentage[predicted_class_index] 
        predicted_class_percentage_str = f"{predicted_class_percentage:.2f}%"

        print(f"Predicted class: {predicted_class}")
        print(f"Predicted class percentage: {predicted_class_percentage_str}")

        return predicted_class, predicted_class_percentage_str
    

    def load_validate_image_file(self, request, jsonify):
        if 'captured_image_file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400

        file = request.files['captured_image_file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        return file
