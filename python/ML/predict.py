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
    def __init__(self):
        self.model_path = os.path.abspath("./models/durian_models.tflite")
        self.model = self.load_tflite_model()

    def load_tflite_model(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file does not exist: {self.model_path}")
        
        interpreter = tf.lite.Interpreter(model_path=self.model_path)
        interpreter.allocate_tensors()
        print("Model loaded successfully.")

        return interpreter

    def load_dataset_classes(self):
        CLASSES = predict.load_dataset_class_names()
        print("CLASSES IN PREDICT: ", CLASSES)
        return CLASSES

    def resize_and_preprocess_image(self, image_path):
        img = Image.open(image_path)
        img = img.resize((180, 180)) 
        img = preprocess_input(np.array(img)) 
        return np.expand_dims(img, axis=0)

    def mollusk_predict(self, image_path):
        print("PREDICT")
        
        preprocessed_image = self.resize_and_preprocess_image(image_path)

        input_details = self.model.get_input_details()
        output_details = self.model.get_output_details()

        input_index = input_details[0]['index']
        output_index = output_details[0]['index']

        self.model.set_tensor(input_index, preprocessed_image)

        self.model.invoke()

        predictions = self.model.get_tensor(output_index)
        print("Predictions:", predictions)

        # CLASSES = ['Blood Clam', 'BullMouth Helmet', 'Horn Snail', 'Invalid Image', 'Mussel', 'Oyster', 'Scaly Clam', 'Tiger Cowrie']
        # CLASSES = self.load_dataset_classes()

        CLASSES = ['Durian Spot', 'Durian blight', 'Healthy', 'Mature', 'Unknown', 'Unripe']
        print("Classes:", CLASSES)

        predicted_class = CLASSES[np.argmax(predictions)]
        print("Predicted class:", predicted_class)

        return predicted_class
    

    def load_validate_image_file(self, request, jsonify):
        if 'captured_image_file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400

        file = request.files['captured_image_file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        return file
